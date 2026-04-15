import express from "express";
import { generateImage } from "../controllers/generate.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/generate", authenticate, generateImage);

export default router;
