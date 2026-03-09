import { HTTP_STATUS, TIER_LIMITS } from "../constants";
import { MessageRole, SubscriptionTier } from "../types";
import { Request, Response } from "express";
import {
  createDbConversation,
  createDbMessage,
  getDbConversationById,
  getDbMessagesByConversationId,
  updateDbConversation,
} from "../adapters/conversations";
import { createDbUser, getDbUserByUserId } from "../adapters/users";
import { getDbUsageForToday, incrementDbUsage } from "../adapters/usage";

import { queryKnowledgeBase } from "../lib/bedrock";

export const sendChatMessage = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Unauthorized - User not authenticated" });
    }

    const { roleSlug } = req.params;
    const { message, conversationId, includePrivateDocs } = req.body;
    const userId = req.user.sub;

    // Get or create user
    let user = await getDbUserByUserId(userId);
    if (!user) {
      user = await createDbUser(req.user.email, userId);
    }

    // Check usage limits for free tier
    const tier = user.tier || SubscriptionTier.FREE;
    const tierLimits = TIER_LIMITS[tier];

    if (tierLimits.questionsPerDay !== null) {
      const usage = await getDbUsageForToday(userId);
      const questionsUsed = usage?.questionsUsed || 0;

      if (questionsUsed >= tierLimits.questionsPerDay) {
        return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
          message:
            "Daily question limit exceeded. Upgrade to Pro for unlimited questions.",
          code: "RATE_LIMITED",
          usage: {
            questionsUsedToday: questionsUsed,
            questionsRemainingToday: 0,
            tier,
          },
        });
      }
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await getDbConversationById(conversationId);
      if (!conversation || conversation.userId !== userId) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Conversation not found" });
      }
    } else {
      // Create new conversation with first message as title
      const title =
        message.length > 50 ? `${message.substring(0, 50)}...` : message;
      conversation = await createDbConversation(userId, roleSlug, title);
    }

    // Save user message
    await createDbMessage(
      conversation.conversationId,
      userId,
      MessageRole.USER,
      message,
    );

    // Get conversation history for context
    const messages = await getDbMessagesByConversationId(
      conversation.conversationId,
    );
    const history = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Query knowledge base
    const ragResponse = await queryKnowledgeBase(
      roleSlug,
      message,
      history,
      includePrivateDocs ? userId : undefined,
    );

    // Save assistant response
    const assistantMessage = await createDbMessage(
      conversation.conversationId,
      userId,
      MessageRole.ASSISTANT,
      ragResponse.answer,
      ragResponse.citations,
    );

    // Update conversation message count
    await updateDbConversation(conversation.conversationId, {
      messageCount: (conversation.messageCount || 0) + 2,
    });

    // Increment usage
    const updatedUsage = await incrementDbUsage(userId, tier);

    res.status(HTTP_STATUS.OK).json({
      conversationId: conversation.conversationId,
      messageId: assistantMessage.messageId,
      response: ragResponse.answer,
      citations: ragResponse.citations,
      usage: {
        questionsUsedToday: updatedUsage.questionsUsed,
        questionsRemainingToday:
          tierLimits.questionsPerDay !== null
            ? tierLimits.questionsPerDay - updatedUsage.questionsUsed
            : null,
        tier,
      },
    });
  } catch (error) {
    console.error("Error in chat:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error processing chat message" });
  }
};
