import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DocumentStatus, PaginatedResponse, UserDocument } from "../types";

import { DOCUMENTS_TABLE } from "../constants";
import dayjs from "dayjs";
import { dynamodb } from "./dynamodb";
import { v4 as uuidv4 } from "uuid";

export const getDbDocumentsByUserId = async (
  userId: string,
  roleSlug: string,
  limit: number = 20,
  lastEvaluatedKey?: Record<string, unknown>,
  status?: string,
): Promise<PaginatedResponse<UserDocument>> => {
  let filterExpression = "roleSlug = :roleSlug";
  const expressionAttributeValues: Record<string, unknown> = {
    ":userId": userId,
    ":roleSlug": roleSlug,
  };

  if (status) {
    filterExpression += " AND #status = :status";
    expressionAttributeValues[":status"] = status;
  }

  const params = {
    TableName: DOCUMENTS_TABLE,
    IndexName: "userId-createdAt-index",
    KeyConditionExpression: "userId = :userId",
    FilterExpression: filterExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ...(status && {
      ExpressionAttributeNames: { "#status": "status" },
    }),
    ScanIndexForward: false,
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return {
      items: (response.Items || []) as UserDocument[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

export const getDbDocumentById = async (
  documentId: string,
): Promise<UserDocument | undefined> => {
  const params = {
    TableName: DOCUMENTS_TABLE,
    Key: { documentId },
  };

  try {
    const response = await dynamodb.send(new GetCommand(params));
    return response.Item as UserDocument | undefined;
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};

export const createDbDocument = async (
  userId: string,
  roleSlug: string,
  fileName: string,
  fileType: string,
  fileSize: number,
  s3Key: string,
  description?: string,
): Promise<UserDocument> => {
  const document: UserDocument = {
    documentId: `doc_${uuidv4()}`,
    userId,
    roleSlug,
    fileName,
    fileType,
    fileSize,
    description,
    s3Key,
    status: DocumentStatus.READY,
    createdAt: dayjs().toISOString(),
  };

  const params = {
    TableName: DOCUMENTS_TABLE,
    Item: document,
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return document;
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

export const deleteDbDocument = async (documentId: string): Promise<void> => {
  const params = {
    TableName: DOCUMENTS_TABLE,
    Key: { documentId },
  };

  try {
    await dynamodb.send(new DeleteCommand(params));
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

export const getDbDocumentCountByUserId = async (
  userId: string,
): Promise<number> => {
  const params = {
    TableName: DOCUMENTS_TABLE,
    IndexName: "userId-createdAt-index",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
    Select: "COUNT" as const,
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return response.Count || 0;
  } catch (error) {
    console.error("Error counting documents:", error);
    throw error;
  }
};
