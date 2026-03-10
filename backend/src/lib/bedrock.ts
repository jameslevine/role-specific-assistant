import { AWS_REGION, BEDROCK_MODEL_ID } from "../constants";
import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

import { Citation } from "../types";
import { getRoleConfig } from "../constants/roles";
import { getUserDocumentContext } from "./user-docs";

const bedrockRuntime = new BedrockRuntimeClient({ region: AWS_REGION });
const bedrockAgentRuntime = new BedrockAgentRuntimeClient({ region: AWS_REGION });

export interface RAGResponse {
  answer: string;
  citations: Citation[];
}

export const queryKnowledgeBase = async (
  roleSlug: string,
  question: string,
  conversationHistory: Array<{ role: string; content: string }>,
  _userId?: string,
): Promise<RAGResponse> => {
  const roleConfig = getRoleConfig(roleSlug);
  if (!roleConfig) {
    throw new Error(`No role configuration found for: ${roleSlug}`);
  }

  // Fetch user document context if userId provided
  let userDocContext = "";
  if (_userId) {
    userDocContext = await getUserDocumentContext(_userId, roleSlug);
  }

  const enhancedSystemPrompt = userDocContext
    ? `${roleConfig.systemPrompt}${userDocContext}`
    : roleConfig.systemPrompt;

  // If the role has a Knowledge Base configured, use RAG
  if (roleConfig.knowledgeBaseId) {
    return queryWithRAG(roleConfig.knowledgeBaseId, enhancedSystemPrompt, question, conversationHistory);
  }

  // Otherwise, fall back to direct model invocation
  return queryDirectModel(enhancedSystemPrompt, question, conversationHistory);
};

async function queryWithRAG(
  knowledgeBaseId: string,
  systemPrompt: string,
  question: string,
  conversationHistory: Array<{ role: string; content: string }>,
): Promise<RAGResponse> {
  // Build context from conversation history
  const historyContext = conversationHistory
    .slice(-10)
    .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
    .join("\n");

  const fullQuery = historyContext
    ? `Previous conversation:\n${historyContext}\n\nCurrent question: ${question}`
    : question;

  try {
    const command = new RetrieveAndGenerateCommand({
      input: { text: fullQuery },
      retrieveAndGenerateConfiguration: {
        type: "KNOWLEDGE_BASE",
        knowledgeBaseConfiguration: {
          knowledgeBaseId,
          modelArn: `arn:aws:bedrock:${AWS_REGION}::foundation-model/${BEDROCK_MODEL_ID}`,
          generationConfiguration: {
            promptTemplate: {
              textPromptTemplate: `${systemPrompt}\n\nUse the following retrieved documents to answer the user's question. Always cite the source document when referencing specific regulations or standards. If the documents don't contain relevant information, use your general knowledge but clearly state that.\n\n$search_results$\n\nUser question: $query$`,
            },
          },
          retrievalConfiguration: {
            vectorSearchConfiguration: {
              numberOfResults: 5,
            },
          },
        },
      },
    });

    const response = await bedrockAgentRuntime.send(command);

    const citations: Citation[] = (response.citations || []).flatMap(
      (citation: any) =>
        (citation.retrievedReferences || []).map((ref: any) => ({
          documentId: ref.location?.s3Location?.uri || "unknown",
          documentName: (ref.metadata?.["x-amz-bedrock-kb-source-uri"] as string)?.split("/").pop() || "Unknown Document",
          excerpt: ref.content?.text?.substring(0, 200) || "",
          source: "shared" as const,
        })),
    );

    return {
      answer: response.output?.text || "I was unable to generate a response. Please try rephrasing your question.",
      citations,
    };
  } catch (error) {
    console.error("Error querying knowledge base, falling back to direct model:", error);
    // Fall back to direct model if KB query fails
    return queryDirectModel(systemPrompt, question, conversationHistory);
  }
}

async function queryDirectModel(
  systemPrompt: string,
  question: string,
  conversationHistory: Array<{ role: string; content: string }>,
): Promise<RAGResponse> {
  const messages = [
    ...conversationHistory.slice(-10).map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    })),
    { role: "user", content: question },
  ];

  try {
    const command = new InvokeModelCommand({
      modelId: BEDROCK_MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 4096,
        system: systemPrompt,
        messages,
      }),
    });

    const response = await bedrockRuntime.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    return {
      answer: responseBody.content?.[0]?.text || "I was unable to generate a response.",
      citations: [],
    };
  } catch (error) {
    console.error("Error invoking Bedrock model:", error);
    throw error;
  }
}
