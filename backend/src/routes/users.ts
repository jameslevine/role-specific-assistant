import { getCurrentUser, updateCurrentUser } from "../controllers/users";

import { cognitoAuthMiddleware } from "../middleware/cognito-auth";
import express from "express";
import { userUpdateBodySchema } from "../models/user";
import { validateBody } from "../middleware/validation";

export const router = express.Router();

router.get("/me", cognitoAuthMiddleware, getCurrentUser);

router.patch(
  "/me",
  cognitoAuthMiddleware,
  validateBody(userUpdateBodySchema),
  updateCurrentUser,
);
