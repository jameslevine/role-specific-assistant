import { Request, Response } from "express";
import { createDbUser, getDbUserByUserId, updateDbUser } from "../adapters/users";

import { HTTP_STATUS } from "../constants";
import { SubscriptionTier } from "../types";
import { getStripe } from "../lib/stripe";

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    const { tier, successUrl, cancelUrl } = req.body;
    const userId = req.user.sub;

    // Get or create user
    let user = await getDbUserByUserId(userId);
    if (!user) {
      user = await createDbUser(req.user.email, userId);
    }

    const stripe = await getStripe();

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });
      customerId = customer.id;
      await updateDbUser(userId, { stripeCustomerId: customerId });
    }

    // Create a price dynamically for the tier
    const priceAmount = tier === "pro" ? 999 : 2999; // £9.99 or £29.99
    const tierName = tier === "pro" ? "TradeAssist Pro" : "TradeAssist Business";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: tierName,
              description: `${tierName} monthly subscription`,
            },
            unit_amount: priceAmount,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        tier,
      },
      subscription_data: {
        metadata: {
          userId,
          tier,
        },
      },
    });

    res.status(HTTP_STATUS.OK).json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating checkout session" });
  }
};

export const getSubscription = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    const userId = req.user.sub;
    const user = await getDbUserByUserId(userId);

    if (!user) {
      return res.status(HTTP_STATUS.OK).json({
        tier: SubscriptionTier.FREE,
        status: "active",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      tier: user.tier || SubscriptionTier.FREE,
      status: "active",
      stripeCustomerId: user.stripeCustomerId,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching subscription" });
  }
};

export const createPortalSession = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    const userId = req.user.sub;
    const user = await getDbUserByUserId(userId);

    if (!user?.stripeCustomerId) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "No billing account found" });
    }

    const stripe = await getStripe();

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${req.headers.origin || "https://d1ov9130iusi6.cloudfront.net"}/${req.params.roleSlug || "electrician"}/billing`,
    });

    res.status(HTTP_STATUS.OK).json({ portalUrl: session.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating portal session" });
  }
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
  try {
    const stripe = await getStripe();
    const event = req.body;

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const tier = session.metadata?.tier;

        if (userId && tier) {
          await updateDbUser(userId, {
            tier: tier as SubscriptionTier,
            stripeCustomerId: session.customer,
          });
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await updateDbUser(userId, { tier: SubscriptionTier.FREE });
        }
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        const tier = subscription.metadata?.tier;

        if (userId && subscription.status === "active" && tier) {
          await updateDbUser(userId, { tier: tier as SubscriptionTier });
        } else if (userId && subscription.status === "canceled") {
          await updateDbUser(userId, { tier: SubscriptionTier.FREE });
        }
        break;
      }
    }

    res.status(HTTP_STATUS.OK).json({ received: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Webhook error" });
  }
};
