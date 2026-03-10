import {
  createCheckoutSession,
  createPortalSession,
  getSubscription,
  handleStripeWebhook,
  verifyCheckoutSession,
} from "../controllers/subscriptions";

import { cognitoAuthMiddleware } from "../middleware/cognito-auth";
import express from "express";
import { subscriptionCheckoutBodySchema } from "../models/user";
import { validateBody } from "../middleware/validation";

export const router = express.Router();

// Authenticated routes
router.post(
  "/checkout",
  cognitoAuthMiddleware,
  validateBody(subscriptionCheckoutBodySchema),
  createCheckoutSession,
);

router.get("/me", cognitoAuthMiddleware, getSubscription);

router.post("/portal", cognitoAuthMiddleware, createPortalSession);

router.post("/verify", cognitoAuthMiddleware, verifyCheckoutSession);

// Webhook (no auth — Stripe sends directly)
router.post("/webhook", handleStripeWebhook);
