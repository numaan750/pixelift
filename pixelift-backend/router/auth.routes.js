import express from "express";
import passport from "../config/passport.config.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/portal/auth/callback?error=google_auth_failed&provider=google`,
    session: false,
  }),
  (req, res) => {
    try {
      console.log("Google callback - User:", req.user.username);

      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      const userData = {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        profilePicture: req.user.profilePicture,
        credits: req.user.credits,
      };

      res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}&provider=google`,
      );
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(
        `${process.env.FRONTEND_URL}/portal/auth/callback/auth/callback?error=token_generation_failed&provider=google`,
      );
    }
  },
);

router.get("/apple", (req, res) => {
  res.redirect(
    `${process.env.FRONTEND_URL}/portal/auth/callback/auth/callback?error=apple_not_configured&provider=apple`,
  );
});

export default router;
