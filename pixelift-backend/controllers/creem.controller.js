import loginSchema from "../models/login.js";
import crypto from "crypto";

const CREEM_API_URL = "https://api.creem.io/v1";

export const createCheckout = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user._id.toString();

    // Product ID ki jagah direct URL use karo
    const baseCheckoutUrl =
      plan === "yearly"
        ? process.env.CREEM_YEARLY_CHECKOUT_URL
        : process.env.CREEM_MONTHLY_CHECKOUT_URL;

    if (!baseCheckoutUrl) {
      return res.status(400).json({
        status: "error",
        message: `Checkout URL missing for plan: ${plan}`,
      });
    }
    const url = new URL(baseCheckoutUrl);
    url.searchParams.set("metadata[userId]", userId);
    url.searchParams.set("metadata[plan]", plan);
    url.searchParams.set(
      "success_url",
      `${process.env.FRONTEND_URL}/payment/success?plan=${plan}`,
    );
    url.searchParams.set(
      "cancel_url",
      `${process.env.FRONTEND_URL}/payment/cancel`,
    );

    const checkoutUrl = url.toString();

    console.log("✅ Checkout URL generated:", checkoutUrl);

    res.status(200).json({
      status: "success",
      checkoutUrl,
    });
  } catch (error) {
    console.error("Create checkout error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers["creem-signature"];
    const rawBody = req.rawBody;

    if (!signature || !rawBody) {
      return res.status(400).json({ message: "Missing signature or body" });
    }

    const expectedSig = crypto
      .createHmac("sha256", process.env.CREEM_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSig) {
      console.error("Webhook signature mismatch");
      return res.status(401).json({ message: "Invalid signature" });
    }

    const event = JSON.parse(rawBody);

    if (event.type === "checkout.completed") {
      const { userId, plan } = event.data?.metadata || {};

      const durationMs =
        plan === "yearly"
          ? 365 * 24 * 60 * 60 * 1000
          : 30 * 24 * 60 * 60 * 1000;

      const expiryDate = new Date(Date.now() + durationMs);

      // CHANGE: sirf isPremium nahi, saari fields update karo
      await loginSchema.findByIdAndUpdate(userId, {
        isPremium: true,
        premiumExpiryDate: expiryDate,
        creemSubscriptionStatus: "subscription.active",
        creemLastEventType: "checkout.completed",
        creemLastCheckoutId: event.data?.id || null,
        creemCustomerId: event.data?.customer_id || null,
        creemSubscriptionId: event.data?.subscription_id || null,
        creemProductId: event.data?.product_id || null,
        $push: {
          creemPaymentHistory: {
            $each: [
              {
                eventType: "checkout.completed",
                plan: plan || null,
                source: "creem-webhook",
                status: "checkout.completed",
                checkoutId: event.data?.id || null,
                subscriptionId: event.data?.subscription_id || null,
                productId: event.data?.product_id || null,
                timestamp: new Date(),
              },
            ],
            $position: 0,
            $slice: 100,
          },
        },
      });
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const checkPremiumStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await loginSchema.findById(userId)
    .select(
        "isPremium premiumExpiryDate creemSubscriptionStatus creemLastEventType creemSubscriptionId creemCustomerId creemProductId creemLastCheckoutId creemPaymentHistory"
      );

    if (
      user.isPremium &&
      user.premiumExpiryDate &&
      new Date() > user.premiumExpiryDate
    ) {
      await loginSchema.findByIdAndUpdate(userId, {
        isPremium: false,
        premiumExpiryDate: null,
      });
      return res.status(200).json({
        status: "success",
        isPremium: false,
        expired: true,
      });
    }

    res.status(200).json({
      status: "success",
      isPremium: user.isPremium,
      premiumExpiryDate: user.premiumExpiryDate,
      creemSubscriptionStatus: user.creemSubscriptionStatus,
      creemLastEventType: user.creemLastEventType,
      creemSubscriptionId: user.creemSubscriptionId,
      expired: false,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await loginSchema
      .findById(userId)
      .select(
        "creemPaymentHistory isPremium premiumExpiryDate creemSubscriptionStatus",
      )
      .lean();

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      history: Array.isArray(user.creemPaymentHistory)
        ? user.creemPaymentHistory
        : [],
      isPremium: user.isPremium,
      premiumExpiryDate: user.premiumExpiryDate,
      creemSubscriptionStatus: user.creemSubscriptionStatus,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
