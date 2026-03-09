import { chatBodySchema, chatParamsSchema } from "../models/chat";
import { validateBody, validateParams } from "../middleware/validation";

import { cognitoAuthMiddleware } from "../middleware/cognito-auth";
import express from "express";
import { sendChatMessage } from "../controllers/chat";

export const router = express.Router({ mergeParams: true });

router.post(
  "/",
  cognitoAuthMiddleware,
  validateParams(chatParamsSchema),
  validateBody(chatBodySchema),
  sendChatMessage,
);
