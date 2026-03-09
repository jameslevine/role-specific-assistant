import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { SubscriptionTier, User } from "../types";

import { USERS_TABLE } from "../constants";
import dayjs from "dayjs";
import { dynamodb } from "./dynamodb";
import { v4 as uuidv4 } from "uuid";

export const getDbUserByUserId = async (
  userId: string,
): Promise<User | undefined> => {
  const params = {
    TableName: USERS_TABLE,
    Key: { userId },
  };

  try {
    const response = await dynamodb.send(new GetCommand(params));
    return response.Item as User | undefined;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const createDbUser = async (
  email: string,
  cognitoSub: string,
): Promise<User> => {
  const now = dayjs().toISOString();
  const user: User = {
    userId: cognitoSub,
    email,
    firstName: "",
    lastName: "",
    selectedRole: "",
    tier: SubscriptionTier.FREE,
    createdAt: now,
    updatedAt: now,
  };

  const params = {
    TableName: USERS_TABLE,
    Item: user,
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateDbUser = async (
  userId: string,
  updates: Partial<
    Pick<
      User,
      "firstName" | "lastName" | "selectedRole" | "tier" | "stripeCustomerId"
    >
  >,
): Promise<User> => {
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
    TableName: USERS_TABLE,
    Key: { userId },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW" as const,
  };

  try {
    const response = await dynamodb.send(new UpdateCommand(params));
    return response.Attributes as User;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
