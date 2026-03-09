import { HTTP_STATUS, TIER_LIMITS } from "../constants";
import { Request, Response } from "express";
import {
  createDbUser,
  getDbUserByUserId,
  updateDbUser,
} from "../adapters/users";

import { SubscriptionTier } from "../types";
import { getDbDocumentCountByUserId } from "../adapters/documents";
import { getDbUsageForToday } from "../adapters/usage";

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const userId = req.user.sub;

    let user = await getDbUserByUserId(userId);
    if (!user) {
      user = await createDbUser(req.user.email, userId);
    }

    const tier = user.tier || SubscriptionTier.FREE;
    const tierLimits = TIER_LIMITS[tier];
    const usage = await getDbUsageForToday(userId);
    const docCount = await getDbDocumentCountByUserId(userId);

    res.status(HTTP_STATUS.OK).json({
      ...user,
      usage: {
        questionsUsedToday: usage?.questionsUsed || 0,
        questionsRemainingToday:
          tierLimits.questionsPerDay !== null
            ? tierLimits.questionsPerDay - (usage?.questionsUsed || 0)
            : null,
        documentsUsed: docCount,
        documentsLimit: tierLimits.documentsTotal,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching user profile" });
  }
};

export const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const userId = req.user.sub;
    const { firstName, lastName, selectedRole } = req.body;

    const updated = await updateDbUser(userId, {
      firstName,
      lastName,
      selectedRole,
    });

    res.status(HTTP_STATUS.OK).json(updated);
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating user profile" });
  }
};
