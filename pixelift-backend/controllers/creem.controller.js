import loginSchema from "../models/login.js";
import crypto from "crypto";

const CREEM_API_URL = "https://api.creem.io/v1";

export const createCheckout = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user._id.toString();

    const productId =
      plan === "yearly"
        ? process.env.CREEM_PRODUCT_YEARLY_ID
        : process.env.CREEM_PRODUCT_MONTHLY_ID;

    if (!productId) {
      return res.status(400).json({
        status: "error",
        message: `Product ID missing for plan: ${plan}`,
      });
    }

    const response = await fetch(`${CREEM_API_URL}/checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CREEM_API_KEY,
      },
      body: JSON.stringify({
        product_id: productId,
        request_id: `${userId}-${Date.now()}`,
        success_url: `${process.env.FRONTEND_URL}/payment/success?plan=${plan}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        metadata: {
          userId: userId,
          plan: plan,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Creem checkout error FULL:",
        JSON.stringify(data, null, 2),
      );
      return res.status(400).json({
        status: "error",
        message: "Failed to create checkout",
      });
    }

    res.status(200).json({
      status: "success",
      checkoutUrl: data.checkout_url || data.url,
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
      const { userId, plan } = event.data.metadata;

      const durationMs =
        plan === "yearly"
          ? 365 * 24 * 60 * 60 * 1000
          : 30 * 24 * 60 * 60 * 1000;

      const expiryDate = new Date(Date.now() + durationMs);

      await loginSchema.findByIdAndUpdate(userId, {
        isPremium: true,
        premiumExpiryDate: expiryDate,
      });

      console.log(`Premium activated for user ${userId}, plan: ${plan}`);
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
    const user = await loginSchema.findById(userId);

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
      expired: false,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
