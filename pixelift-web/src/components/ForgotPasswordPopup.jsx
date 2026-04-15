"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "@/context/Appcontext";

export default function ForgotPasswordPopup({ isOpen, onClose }) {
  const {
    requestPasswordReset,
    verifyResetCode,
    resetPassword,
    resetPasswordLoading,
    resetPasswordError,
  } = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);

    try {
      const data = await requestPasswordReset(email);

      if (data.status === "success") {
        setSuccess("Reset code sent to your email!");
        setTimeout(() => {
          setStep(2);
          setSuccess("");
        }, 1500);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!code.trim()) {
      setError("Please enter the code");
      return;
    }

    if (code.length !== 6) {
      setError("Code must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      const data = await verifyResetCode(email, code);

      if (data.status === "success") {
        setSuccess("Code verified!");
        setTimeout(() => {
          setStep(3);
          setSuccess("");
        }, 1000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const data = await resetPassword(email, code, newPassword);

      if (data.status === "success") {
        setSuccess("Password reset successfully!");
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail("");
    setCode("");
    setNewPassword("");
    setError("");
    setSuccess("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-gradient-to-r from-[#3B7FFF]/10 to-[#2CAA78]/10 border border-[#EAEAEA80] rounded-2xl p-6 sm:p-8 max-w-md w-full relative">
        <button
          onClick={handleClose}
          className="absolute cursor-pointer top-4 right-4 text-white"
        >
          <X size={24} />
        </button>

        <div className="flex justify-center mb-4">
          <Image
            src="/images/pixellift.png"
            alt="Logo"
            width={48}
            height={48}
            className="rounded-xl"
          />
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-2">
          {step === 1 && "Forgot Password?"}
          {step === 2 && "Enter Verification Code"}
          {step === 3 && "Set New Password"}
        </h2>

        <p className="text-white text-center mb-6 text-sm">
          {step === 1 && "Enter your email to receive a reset code"}
          {step === 2 && "We sent a 6-digit code to your email"}
          {step === 3 && "Create a new password for your account"}
        </p>

        {(error || success) && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              error
                ? "bg-red-500/10 border border-red-500/20"
                : "bg-green-500/10 border border-green-500/20"
            }`}
          >
            <p
              className={`text-sm text-center ${error ? "text-red-400" : "text-green-400"}`}
            >
              {error || success}
            </p>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl bg-[#EAEAEA] text-[#3f3a3a80] outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 cursor-pointer bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-semibold rounded-xl "
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl bg-[#EAEAEA] text-[#564b4b80] text-center text-2xl tracking-widest outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 cursor-pointer bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-semibold rounded-xl "
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full cursor-pointer text-white text-sm"
            >
              Resend Code
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 pr-12 rounded-xl bg-[#EAEAEA] text-[#67565680] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <p className="text-white text-sm">At least 8 characters</p>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 cursor-pointer bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-semibold rounded-xl "
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

