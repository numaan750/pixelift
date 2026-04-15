import loginSchema from "../models/login.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendResetCodeEmail } from "../config/email.config.js";

const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await loginSchema.find().select("-password");
    res.status(200).json({
      status: "success",
      users,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await loginSchema.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const signupUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email required.",
      });
    }
    const existingUser = await loginSchema.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User already exists with this email.",
      });
    }

    if (!password) {
      return res.status(400).json({
        status: "error",
        message: "Password required.",
      });
    }
    if (!username) {
      return res.status(400).json({
        status: "error",
        message: "Username required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 8 characters long.",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await loginSchema.create({
      email,
      password: hashedPassword,
      username,
      provider: "local",
      credits: 1,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      status: "success",
      message: "Account created successfully",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        credits: user.credits,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email required.",
      });
    }
    if (!password) {
      return res.status(400).json({
        status: "error",
        message: "Password required.",
      });
    }
    const user = await loginSchema.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password.",
      });
    }

    if (!user.password) {
      return res.status(401).json({
        status: "error",
        message: "This account uses Google login. Please login with Google.",
      });
    }
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password.",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        credits: user.credits,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, currentPassword, newPassword } = req.body;

    const user = await loginSchema.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          status: "error",
          message: "Current password is required to set new password",
        });
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        return res.status(400).json({
          status: "error",
          message: "Current password is incorrect",
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          status: "error",
          message: "New password must be at least 8 characters long.",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    if (username) user.username = username;
    if (email) {
      const existingUser = await loginSchema.findOne({
        email,
        _id: { $ne: id },
      });
      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "Email already in use by another account",
        });
      }
      user.email = email;
    }

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id) {
      return res.status(403).json({
        status: "error",
        message: "You are not allowed to delete this account",
      });
    }

    const user = await loginSchema.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required",
      });
    }

    const user = await loginSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "No account found with this email",
      });
    }

    const resetCode = generateResetCode();

    const hashedCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    user.resetPasswordToken = hashedCode;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendResetCodeEmail(email, resetCode);

    res.status(200).json({
      status: "success",
      message: "Reset code sent to your email",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to send reset code. Please try again.",
    });
  }
};

export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        status: "error",
        message: "Email and code are required",
      });
    }

    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    const user = await loginSchema.findOne({
      email,
      resetPasswordToken: hashedCode,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired reset code",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Code verified successfully",
    });
  } catch (error) {
    console.error("Verify code error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Email, code, and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 8 characters long",
      });
    }

    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    const user = await loginSchema.findOne({
      email,
      resetPasswordToken: hashedCode,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired reset code",
      });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
