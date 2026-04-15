import express from "express";
import {
  activateFakePremium,
  checkPremiumStatus,
} from "../controllers/premium.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/premium/activate", authenticate, activateFakePremium);
router.get("/premium/status", authenticate, checkPremiumStatus);

export default router;
