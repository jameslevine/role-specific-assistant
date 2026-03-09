import { CONVERSATIONS_TABLE, MESSAGES_TABLE } from "../constants";
import {
  Conversation,
  Message,
  MessageRole,
  PaginatedResponse,
} from "../types";
import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import dayjs from "dayjs";
import { dynamodb } from "./dynamodb";
import { v4 as uuidv4 } from "uuid";

export const getDbConversationsByUserId = async (
  userId: string,
  roleSlug: string,
  limit: number = 20,
  lastEvaluatedKey?: Record<string, unknown>,
): Promise<PaginatedResponse<Conversation>> => {
  const params = {
    TableName: CONVERSATIONS_TABLE,
    IndexName: "userId-updatedAt-index",
    KeyConditionExpression: "userId = :userId",
    FilterExpression: "roleSlug = :roleSlug",
    ExpressionAttributeValues: {
      ":userId": userId,
      ":roleSlug": roleSlug,
    },
    ScanIndexForward: false,
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return {
      items: (response.Items || []) as Conversation[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

export const getDbConversationById = async (
  conversationId: string,
): Promise<Conversation | undefined> => {
  const params = {
    TableName: CONVERSATIONS_TABLE,
    Key: { conversationId },
  };

  try {
    const response = await dynamodb.send(new GetCommand(params));
    return response.Item as Conversation | undefined;
  } catch (error) {
    console.error("Error fetching conversation:", error);
    throw error;
  }
};

export const createDbConversation = async (
  userId: string,
  roleSlug: string,
  title: string,
): Promise<Conversation> => {
  const now = dayjs().toISOString();
  const conversation: Conversation = {
    conversationId: `conv_${uuidv4()}`,
    userId,
    roleSlug,
    title,
    messageCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const params = {
    TableName: CONVERSATIONS_TABLE,
    Item: conversation,
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return conversation;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};

export const updateDbConversation = async (
  conversationId: string,
  updates: Partial<Pick<Conversation, "title" | "messageCount">>,
): Promise<Conversation> => {
  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, unknown> = {};

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    }
  });

  updateExpressions.push("#updatedAt = :updatedAt");
  expressionAttributeNames["#updatedAt"] = "updatedAt";
  expressionAttributeValues[":updatedAt"] = dayjs().toISOString();

  const params = {
    TableName: CONVERSATIONS_TABLE,
    Key: { conversationId },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW" as const,
  };

  try {
    const response = await dynamodb.send(new UpdateCommand(params));
    return response.Attributes as Conversation;
  } catch (error) {
    console.error("Error updating conversation:", error);
    throw error;
  }
};

export const deleteDbConversation = async (
  conversationId: string,
): Promise<void> => {
  const params = {
    TableName: CONVERSATIONS_TABLE,
    Key: { conversationId },
  };

  try {
    await dynamodb.send(new DeleteCommand(params));
  } catch (error) {
    console.error("Error deleting conversation:", error);
    throw error;
  }
};

// Messages

export const getDbMessagesByConversationId = async (
  conversationId: string,
  limit: number = 50,
): Promise<Message[]> => {
  const params = {
    TableName: MESSAGES_TABLE,
    IndexName: "conversationId-createdAt-index",
    KeyConditionExpression: "conversationId = :conversationId",
    ExpressionAttributeValues: {
      ":conversationId": conversationId,
    },
    ScanIndexForward: true,
    Limit: limit,
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return (response.Items || []) as Message[];
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const createDbMessage = async (
  conversationId: string,
  userId: string,
  role: MessageRole,
  content: string,
  citations?: Message["citations"],
): Promise<Message> => {
  const message: Message = {
    messageId: `msg_${uuidv4()}`,
    conversationId,
    userId,
    role,
    content,
    citations,
    createdAt: dayjs().toISOString(),
  };

  const params = {
    TableName: MESSAGES_TABLE,
    Item: message,
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return message;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};
