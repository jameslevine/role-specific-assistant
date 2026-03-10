import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

import { AWS_REGION } from "../constants";
import Stripe from "stripe";

const secretsManager = new SecretsManagerClient({ region: AWS_REGION });

let stripeInstance: Stripe | null = null;

export const getStripe = async (): Promise<Stripe> => {
  if (stripeInstance) return stripeInstance;

  const secretArn =
    process.env.STRIPE_SECRET_KEY_ARN || "tradeassist-stripe-secret-key";

  try {
    const command = new GetSecretValueCommand({ SecretId: secretArn });
    const response = await secretsManager.send(command);
    const secretKey = response.SecretString;

    if (!secretKey) {
      throw new Error("Stripe secret key not found in Secrets Manager");
    }

    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion,
    });

    return stripeInstance;
  } catch (error) {
    console.error("Error initializing Stripe:", error);
    throw error;
  }
};

// Stripe price IDs — these will be created in Stripe Dashboard
// For now, we'll create them programmatically on first use
export const STRIPE_PRICES = {
  pro: process.env.STRIPE_PRO_PRICE_ID || "",
  business: process.env.STRIPE_BUSINESS_PRICE_ID || "",
};
