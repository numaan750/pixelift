"use client";

import Image from "next/image";
import React, { useState, useContext, useEffect } from "react";
import { MdOutlineMail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { AppContext } from "@/context/Appcontext";
import { useRouter, useSearchParams } from "next/navigation";
import ForgotPasswordPopup from "@/components/ForgotPasswordPopup";

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    signup,
    login,
    authenticated,
    authLoading,
    error,
    setError,
    loading,
    loginWithGoogle,
  } = useContext(AppContext);

  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [validationError, setValidationError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  useEffect(() => {
  const mode = searchParams.get("mode");

  if (mode === "signup") {
    setIsSignup(true);
  } else {
    setIsSignup(false);
  }
}, [searchParams]);

  useEffect(() => {
    if (!authLoading && authenticated) {
      router.replace("/portal/dashboard");
    }
  }, [authenticated, authLoading, router]);

  if (authLoading || authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#12171B]">
        <div className="w-12 h-12 border-4 border-[#AABFFF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError("");
    setError(null);
  };
  const validateForm = () => {
    if (isSignup && !formData.username.trim()) {
      setValidationError("Please enter your name");
      return false;
    }
    if (!formData.email.trim()) {
      setValidationError("Please enter your email");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setValidationError("Please enter a valid email");
      return false;
    }
    if (!formData.password) {
      setValidationError("Please enter your password");
      return false;
    }
    if (isSignup && formData.password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isSignup) {
        const result = await signup({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        if (result.status === "success") {
          router.push("/portal/dashboard");
        }
      } else {
        const result = await login({
          email: formData.email,
          password: formData.password,
        });

        if (result.status === "success") {
          router.replace("/portal/dashboard");
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
    }
  };
  const toggleMode = () => {
    setIsSignup(!isSignup);
    setFormData({
      username: "",
      email: "",
      password: "",
    });
    setValidationError("");
    setError(null);
  };
  const handleGoogleLogin = async () => {
    try {
      setValidationError("");
      setError(null);

      const result = await loginWithGoogle();

      if (result.status === "success") {
        router.replace("/portal/dashboard");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setValidationError(err.message || "Google login failed");
    }
  };

  const handleAppleLogin = async () => {
    try {
      setValidationError("");
      setError(null);

      const result = await loginWithApple();

      if (result.status === "success") {
        router.replace("/portal/dashboard");
      }
    } catch (err) {
      console.error("Apple login error:", err);
      setValidationError(err.message || "Apple login coming soon");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-[#12171B] py-5">
      <div className="absolute inset-0 bg-[#12171B]" />
      <div className="relative min-h-screen flex flex-col lg:flex-row-reverse">
        <div className="w-full flex items-center justify-center px-4">
          <div className="w-full sm:w-[600px] bg-gradient-to-r from-[#3B7FFF]/10 to-[#2CAA78]/10 border border-[#EAEAEA80] rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-center mb-2">
              <Image
                src="/images/pixellift.png"
                alt="Logo"
                width={48}
                height={48}
                className="rounded-2xl sm:w-14 sm:h-14 lg:w-16 lg:h-16"
              />
            </div>

            <h1 className="text-white font-bold text-center mb-2 text-[22px] sm:text-[24px] lg:text-[26px]">
              {isSignup ? "Create an Account" : "LOGIN TO PIXELIFT"}
            </h1>
            <p className="text-[#FFFFFF80] text-[12px] sm:text-[12px] lg:text-[14px] text-center mb-5">
              {isSignup
                ? "Create an account to continue"
                : "Log in to your account"}
            </p>

            {(validationError || error) && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm text-center">
                  {validationError || error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {isSignup && (
                <div className="relative w-full">
                  <FaRegUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A4A4A4] text-[16px] sm:text-[18px]" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full pl-10 sm:pl-12 pr-4 sm:pr-5 py-3 sm:py-4 rounded-xl bg-[#283638] border border-[#30363d] text-[#A4A4A4] placeholder-gray-500 outline-none text-[14px] sm:text-[16px] font-medium"
                  />
                </div>
              )}

              <div className="relative w-full">
                <MdOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A4A4A4] text-[20px]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-5 py-4 rounded-xl bg-[#283638] border border-[#30363d] text-[#A4A4A4] placeholder-gray-500 outline-none text-[16px] font-medium"
                />
              </div>

              <div className="relative w-full">
                <CiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A4A4A4] text-[20px]" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-4 rounded-xl bg-[#283638] border border-[#30363d] text-[#A4A4A4] placeholder-gray-500 outline-none text-[16px] font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A4A4A4] cursor-pointer"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 4.5C5 4.5 1.73 7.61 0 10c1.73 2.39 5 5.5 10 5.5s8.27-3.11 10-5.5c-1.73-2.39-5-5.5-10-5.5zM10 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                      <circle cx="10" cy="10" r="2.5" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 4.5C7 4.5 3.73 7.61 2 10c.64.88 1.46 1.71 2.41 2.41l-1.1 1.1a.75.75 0 101.06 1.06l14-14a.75.75 0 10-1.06-1.06l-1.06 1.06C18.27 4.88 15.21 4.5 12 4.5zM12 14c-2.21 0-4-1.79-4-4 0-.71.21-1.37.57-1.93l1.48 1.48A2 2 0 0012 12a2 2 0 002-2c0-.34-.09-.66-.25-.93l1.47-1.47A3.982 3.982 0 0116 10c0 2.21-1.79 4-4 4z" />
                    </svg>
                  )}
                </button>
              </div>

              {isSignup ? (
                <p className="text-[#F6F6F6] text-[14px]">
                  At least 8 characters
                </p>
              ) : (
                <div className="text-left">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-[#F6F6F6] cursor-pointer text-[14px] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <div className="flex justify-center ">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer py-3 rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-semibold text-[18px] tracking-wide"
                >
                  {loading
                    ? "Please wait..."
                    : isSignup
                      ? "Create Account"
                      : "Log In"}
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-[#EAEAEA]" />
                <span className="text-[#EAEAEA] text-[13px] whitespace-nowrap">
                  Or continue with
                </span>
                <div className="flex-1 h-px bg-[#EAEAEA]" />
              </div>

              <div className="flex">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="flex-1 py-3 cursor-pointer rounded-full bg-[#262d36] border border-[#00000040] text-white flex items-center justify-center gap-3 text-[15px]"
                >
                  <svg width="20" height="20" viewBox="0 0 48 48">
                    <path
                      fill="#FFC107"
                      d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.1-.1-2.3-.4-3.5z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 44c5.3 0 10.2-2 13.8-5.2l-6.4-5.3C29.4 35.9 26.8 36 24 36c-5.4 0-9.9-3.5-11.5-8.4l-6.5 5C9.2 39.7 16.1 44 24 44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.6 20.5H42V20H24v8h11.3c-1.2 3.2-3.7 5.5-6.3 7l6.4 5.3C38.9 36.9 44 31.2 44 24c0-1.1-.1-2.3-.4-3.5z"
                    />
                  </svg>
                  <span className="font-medium text-[16px]">Google</span>
                </button>
              </div>

              <p className="text-center text-[#B6B6B6] text-[14px]">
                {isSignup ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] bg-clip-text text-transparent underline cursor-pointer"
                    >
                      Login
                    </button>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] bg-clip-text text-transparent underline cursor-pointer"
                    >
                      Sign up
                    </button>
                  </>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
      <ForgotPasswordPopup
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
};

export default Login;
