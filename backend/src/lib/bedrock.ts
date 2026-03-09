import { AWS_REGION, BEDROCK_MODEL_ID } from "../constants";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

import { Citation } from "../types";
import { getRoleConfig } from "../constants/roles";

const bedrockRuntime = new BedrockRuntimeClient({
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
  _userId?: string,
): Promise<RAGResponse> => {
  const roleConfig = getRoleConfig(roleSlug);
  if (!roleConfig) {
    throw new Error(`No role configuration found for: ${roleSlug}`);
  }

  const systemPrompt = roleConfig.systemPrompt;

  // Build messages array for Claude
  const messages = [
    ...conversationHistory.slice(-10).map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    })),
    {
      role: "user",
      content: question,
    },
  ];

  try {
    // Use Claude 3.7 Sonnet via Bedrock InvokeModel
    const modelId = BEDROCK_MODEL_ID.includes("claude-3-5")
      ? "anthropic.claude-3-7-sonnet-20250219-v1:0"
      : BEDROCK_MODEL_ID;

    const command = new InvokeModelCommand({
      modelId,
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

    const answer =
      responseBody.content?.[0]?.text ||
      "I was unable to generate a response. Please try rephrasing your question.";

    // No citations in direct invoke mode — will be added when KB is set up
    const citations: Citation[] = [];

    return {
      answer,
      citations,
    };
  } catch (error) {
    console.error("Error invoking Bedrock model:", error);
    throw error;
  }
};

// Placeholder for future KB-based retrieval
export const retrieveFromKnowledgeBase = async (
  _knowledgeBaseId: string,
  _query: string,
  _numberOfResults: number = 5,
) => {
  // Will be implemented when Bedrock Knowledge Base is set up
  return [];
};
