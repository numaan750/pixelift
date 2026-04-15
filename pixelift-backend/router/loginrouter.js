import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  requestPasswordReset,
  resetPassword,
  signupUser,
  updateUser,
  verifyResetCode,
} from "../controllers/logincontroller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getGallery } from "../controllers/gallery.controller.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/users", authenticate, getAllUsers);
router.get("/users/:id", authenticate, getUserById);
router.put("/users/:id", authenticate, updateUser);
router.delete("/users/:id", authenticate, deleteUser);
router.post("/forgot-password", requestPasswordReset);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);
router.get("/gallery", authenticate, getGallery);

export default router;
