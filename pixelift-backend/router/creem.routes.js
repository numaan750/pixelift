import express from "express";
import {
  createCheckout,
  handleWebhook,
  checkPremiumStatus,
  getPaymentHistory,
} from "../controllers/creem.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/creem/checkout", authenticate, createCheckout);
router.post("/creem/webhook", handleWebhook);
router.get("/premium/status", authenticate, checkPremiumStatus);
router.get("/premium/history", authenticate, getPaymentHistory);

export default router;
