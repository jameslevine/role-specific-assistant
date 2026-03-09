import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { SubscriptionTier, UsageRecord } from "../types";

import { USAGE_TABLE } from "../constants";
import dayjs from "dayjs";
import { dynamodb } from "./dynamodb";

export const getDbUsageForToday = async (
  userId: string,
): Promise<UsageRecord | undefined> => {
  const today = dayjs().format("YYYY-MM-DD");
  const params = {
    TableName: USAGE_TABLE,
    Key: { userId, date: today },
  };

  try {
    const response = await dynamodb.send(new GetCommand(params));
    return response.Item as UsageRecord | undefined;
  } catch (error) {
    console.error("Error fetching usage:", error);
    throw error;
  }
};

export const incrementDbUsage = async (
  userId: string,
  tier: SubscriptionTier,
): Promise<UsageRecord> => {
  const today = dayjs().format("YYYY-MM-DD");
  const params = {
    TableName: USAGE_TABLE,
    Key: { userId, date: today },
    UpdateExpression:
      "SET questionsUsed = if_not_exists(questionsUsed, :zero) + :inc, tier = :tier",
    ExpressionAttributeValues: {
      ":zero": 0,
      ":inc": 1,
      ":tier": tier,
    },
    ReturnValues: "ALL_NEW" as const,
  };

  try {
    const response = await dynamodb.send(new UpdateCommand(params));
    return response.Attributes as UsageRecord;
  } catch (error) {
    console.error("Error incrementing usage:", error);
    throw error;
  }
};
