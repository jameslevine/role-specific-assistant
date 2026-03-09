import { AWS_REGION, BEDROCK_MODEL_ID } from "../constants";
import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
  RetrieveCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

import { Citation } from "../types";
import { getRoleConfig } from "../constants/roles";

const bedrockAgentRuntime = new BedrockAgentRuntimeClient({
  region: AWS_REGION,
});

export interface RAGResponse {
  answer: string;
  citations: Citation[];
}

export const queryKnowledgeBase = async (
  roleSlug: string,
  question: string,
  conversationHistory: Array<{ role: string; content: string }>,
  userId?: string,
): Promise<RAGResponse> => {
  const roleConfig = getRoleConfig(roleSlug);
  if (!roleConfig || !roleConfig.knowledgeBaseId) {
    throw new Error(`No knowledge base configured for role: ${roleSlug}`);
  }

  const systemPrompt = roleConfig.systemPrompt;

  // Build context from conversation history
  const historyContext = conversationHistory
    .slice(-10) // Last 10 messages for context
    .map(
      (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`,
    )
    .join("\n");

  const fullQuery = historyContext
    ? `Previous conversation:\n${historyContext}\n\nCurrent question: ${question}`
    : question;

  try {
    const command = new RetrieveAndGenerateCommand({
      input: {
        text: fullQuery,
      },
      retrieveAndGenerateConfiguration: {
        type: "KNOWLEDGE_BASE",
        knowledgeBaseConfiguration: {
          knowledgeBaseId: roleConfig.knowledgeBaseId,
          modelArn: `arn:aws:bedrock:${AWS_REGION}::foundation-model/${BEDROCK_MODEL_ID}`,
          generationConfiguration: {
            promptTemplate: {
              textPromptTemplate: `${systemPrompt}\n\nUse the following retrieved documents to answer the user's question. Always cite the source document when referencing specific regulations or standards.\n\n$search_results$\n\nUser question: $query$`,
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
      (citation) =>
        (citation.retrievedReferences || []).map((ref) => ({
          documentId: ref.location?.s3Location?.uri || "unknown",
          documentName:
            (ref.metadata?.["fileName"] as string) || "Unknown Document",
          excerpt: ref.content?.text || "",
          source: "shared" as const,
        })),
    );

    return {
      answer:
        response.output?.text ||
        "I was unable to generate a response. Please try rephrasing your question.",
      citations,
    };
  } catch (error) {
    console.error("Error querying knowledge base:", error);
    throw error;
  }
};

export const retrieveFromKnowledgeBase = async (
  knowledgeBaseId: string,
  query: string,
  numberOfResults: number = 5,
) => {
  try {
    const command = new RetrieveCommand({
      knowledgeBaseId,
      retrievalQuery: {
        text: query,
      },
      retrievalConfiguration: {
        vectorSearchConfiguration: {
          numberOfResults,
        },
      },
    });

    const response = await bedrockAgentRuntime.send(command);
    return response.retrievalResults || [];
  } catch (error) {
    console.error("Error retrieving from knowledge base:", error);
    throw error;
  }
};
