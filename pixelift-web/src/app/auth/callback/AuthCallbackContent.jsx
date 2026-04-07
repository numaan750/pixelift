"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AuthCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");
    const error = searchParams.get("error");
    const provider = searchParams.get("provider") || "google";

    if (window.opener) {
      if (error) {
        const messageType =
          provider === "apple" ? "APPLE_AUTH_ERROR" : "GOOGLE_AUTH_ERROR";

        window.opener.postMessage(
          {
            type: messageType,
            error: error,
          },
          window.location.origin,
        );
        window.close();
        return;
      }

      if (token && userStr) {
        try {
          const user = JSON.parse(decodeURIComponent(userStr));
          const messageType =
            provider === "apple" ? "APPLE_AUTH_SUCCESS" : "GOOGLE_AUTH_SUCCESS";

          window.opener.postMessage(
            {
              type: messageType,
              token: token,
              user: user,
            },
            window.location.origin,
          );

          setTimeout(() => {
            window.close();
          }, 500);
        } catch (err) {
          const messageType =
            provider === "apple" ? "APPLE_AUTH_ERROR" : "GOOGLE_AUTH_ERROR";

          window.opener.postMessage(
            {
              type: messageType,
              error: "Invalid callback data",
            },
            window.location.origin,
          );
          window.close();
        }
      }
    } else {
      if (error) {
        window.location.href = `/login?error=${error}`;
      } else if (token && userStr) {
        try {
          const user = JSON.parse(decodeURIComponent(userStr));
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          window.location.href = "/portal/dashboard";
        } catch {
          window.location.href = "/login?error=invalid_callback";
        }
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#AABFFF] mx-auto mb-4"></div>
        <p className="text-black text-xl">Processing authentication...</p>
        <p className="text-gray-600 text-sm mt-2">
          This window will close automatically
        </p>
      </div>
    </div>
  );
}
