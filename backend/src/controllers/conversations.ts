import { Request, Response } from "express";
import {
  deleteDbConversation,
  getDbConversationById,
  getDbConversationsByUserId,
  getDbMessagesByConversationId,
  updateDbConversation,
} from "../adapters/conversations";

import { HTTP_STATUS } from "../constants";

export const getConversations = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const { roleSlug } = req.params;
    const { limit, lastEvaluatedKey } = req.query;
    const userId = req.user.sub;

    const parsedKey = lastEvaluatedKey
      ? JSON.parse(Buffer.from(lastEvaluatedKey as string, "base64").toString())
      : undefined;

    const result = await getDbConversationsByUserId(
      userId,
      roleSlug,
      Number(limit) || 20,
      parsedKey,
    );

    res.status(HTTP_STATUS.OK).json({
      conversations: result.items,
      lastEvaluatedKey: result.lastEvaluatedKey
        ? Buffer.from(JSON.stringify(result.lastEvaluatedKey)).toString(
            "base64",
          )
        : undefined,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching conversations" });
  }
};

export const getConversationById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const { conversationId } = req.params;
    const userId = req.user.sub;

    const conversation = await getDbConversationById(conversationId);
    if (!conversation || conversation.userId !== userId) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Conversation not found" });
    }

    const messages = await getDbMessagesByConversationId(conversationId);

    res.status(HTTP_STATUS.OK).json({
      ...conversation,
      messages,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching conversation" });
  }
};

export const updateConversation = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const { conversationId } = req.params;
    const { title } = req.body;
    const userId = req.user.sub;

    const conversation = await getDbConversationById(conversationId);
    if (!conversation || conversation.userId !== userId) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Conversation not found" });
    }

    const updated = await updateDbConversation(conversationId, { title });

    res.status(HTTP_STATUS.OK).json({
      conversationId: updated.conversationId,
      title: updated.title,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    console.error("Error updating conversation:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating conversation" });
  }
};

export const deleteConversation = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const { conversationId } = req.params;
    const userId = req.user.sub;

    const conversation = await getDbConversationById(conversationId);
    if (!conversation || conversation.userId !== userId) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Conversation not found" });
    }

    await deleteDbConversation(conversationId);

    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error deleting conversation" });
  }
};
