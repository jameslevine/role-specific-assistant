import {
  conversationListQuerySchema,
  conversationParamsSchema,
  conversationUpdateBodySchema,
} from "../models/conversation";
import {
  deleteConversation,
  getConversationById,
  getConversations,
  updateConversation,
} from "../controllers/conversations";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validation";

import { cognitoAuthMiddleware } from "../middleware/cognito-auth";
import express from "express";

export const router = express.Router({ mergeParams: true });

router.get(
  "/",
  cognitoAuthMiddleware,
  validateQuery(conversationListQuerySchema),
  getConversations,
);

router.get(
  "/:conversationId",
  cognitoAuthMiddleware,
  validateParams(conversationParamsSchema),
  getConversationById,
);

router.patch(
  "/:conversationId",
  cognitoAuthMiddleware,
  validateParams(conversationParamsSchema),
  validateBody(conversationUpdateBodySchema),
  updateConversation,
);

router.delete(
  "/:conversationId",
  cognitoAuthMiddleware,
  validateParams(conversationParamsSchema),
  deleteConversation,
);
