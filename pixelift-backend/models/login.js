import mongoose from "mongoose";

const loginSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    profilePicture: {
      type: String,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    premiumExpiryDate: {
      type: Date,
      default: null,
    },
    // paymnet history k liya hy ya
    creemCustomerId: { type: String, default: null },
    creemSubscriptionId: { type: String, default: null },
    creemProductId: { type: String, default: null },
    creemLastCheckoutId: { type: String, default: null },
    creemSubscriptionStatus: { type: String, default: null },
    creemLastEventType: { type: String, default: null },
    creemPaymentHistory: [
      {
        eventType: { type: String, default: null },
        plan: { type: String, default: null },
        source: { type: String, default: "creem" },
        status: { type: String, default: null },
        checkoutId: { type: String, default: null },
        subscriptionId: { type: String, default: null },
        productId: { type: String, default: null },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    credits: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

const Login = mongoose.model("Login", loginSchema);

export default Login;
