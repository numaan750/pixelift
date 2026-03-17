"use client";
import React, { createContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [projectcache, setProjectcache] = useState({});
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState(null);
  const authSuccessRef = useRef(false);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumExpiryDate, setPremiumExpiryDate] = useState(null);
  const [credits, setCredits] = useState(0);
  const [gallery, setGallery] = useState([]);

  const [soulmateCache, setSoulmateCache] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("soulmateCache");
      return cached ? JSON.parse(cached) : null;
    }
    return null;
  });
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedPremium = localStorage.getItem("isPremium");
    const storedExpiry = localStorage.getItem("premiumExpiryDate");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      const storedCredits = JSON.parse(storedUser).credits || 0;
      setCredits(storedCredits);
      setAuthenticated(true);
    }

    if (storedPremium === "true" && storedExpiry) {
      if (new Date() < new Date(storedExpiry)) {
        setIsPremium(true);
        setPremiumExpiryDate(new Date(storedExpiry));
      } else {
        localStorage.removeItem("isPremium");
        localStorage.removeItem("premiumExpiryDate");
      }
    }

    setAuthLoading(false);
  }, []);

  const signup = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);
        setCredits(data.user.credits || 0);
        setAuthenticated(true);
      } else {
        setError(data.message);
      }

      setLoading(false);
      return data;
    } catch (error) {
      console.error("Error during signup:", error);
      setError("Network error. Please try again.");
      setLoading(false);
      throw error;
    }
  };
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);
        setCredits(data.user.credits || 0);
        setAuthenticated(true);
      } else {
        setError(data.message);
      }

      setLoading(false);
      return data;
    } catch (error) {
      console.error("Error during login:", error);
      setError("Network error. Please try again.");
      setLoading(false);
      throw error;
    }
  };
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setAuthenticated(false);
    setProjectcache({});
    setSoulmateCache(null);
    setIsPremium(false);
    setPremiumExpiryDate(null);
    router.replace("/login");
  };
  const activatePremium = async (plan) => {
    try {
      const response = await fetch(`${API_URL}/api/premium/activate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setIsPremium(true);
        setPremiumExpiryDate(new Date(data.premiumExpiryDate));
        localStorage.setItem("isPremium", "true");
        localStorage.setItem("premiumExpiryDate", data.premiumExpiryDate);
        if (user) {
          const updatedUser = {
            ...user,
            isPremium: true,
            premiumExpiryDate: data.premiumExpiryDate,
          };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }

      return data;
    } catch (error) {
      console.error("Premium activation error:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!isPremium || !premiumExpiryDate) return;

    const interval = setInterval(() => {
      if (new Date() > new Date(premiumExpiryDate)) {
        setIsPremium(false);
        setPremiumExpiryDate(null);
        localStorage.removeItem("isPremium");
        localStorage.removeItem("premiumExpiryDate");
        if (user) {
          const updatedUser = {
            ...user,
            isPremium: false,
            premiumExpiryDate: null,
          };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPremium, premiumExpiryDate]);

  const updateProfile = async (userId, updateData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.status === "success") {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      } else {
        setError(data.message);
      }

      setLoading(false);
      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Network error. Please try again.");
      setLoading(false);
      throw error;
    }
  };

  const deleteprofile = async (userId) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        // Clear everything
        localStorage.clear();
        setUser(null);
        setToken(null);
        setAuthenticated(false);
        setProjectcache({});

        // Redirect to login page
        router.replace("/login");
      } else {
        setError(data.message);
      }

      setLoading(false);
      return data;
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Network error. Please try again.");
      setLoading(false);
      throw error;
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      setResetPasswordError(null);
      setResetPasswordLoading(true);

      const response = await fetch(`${API_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.status !== "success") {
        setResetPasswordError(data.message);
      }

      setResetPasswordLoading(false);
      return data;
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setResetPasswordError("Network error. Please try again.");
      setResetPasswordLoading(false);
      throw error;
    }
  };

  const verifyResetCode = async (email, code) => {
    try {
      setResetPasswordError(null);
      setResetPasswordLoading(true);

      const response = await fetch(`${API_URL}/api/verify-reset-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (data.status !== "success") {
        setResetPasswordError(data.message);
      }

      setResetPasswordLoading(false);
      return data;
    } catch (error) {
      console.error("Error verifying reset code:", error);
      setResetPasswordError("Network error. Please try again.");
      setResetPasswordLoading(false);
      throw error;
    }
  };

  const resetPassword = async (email, code, newPassword) => {
    try {
      setResetPasswordError(null);
      setResetPasswordLoading(true);

      const response = await fetch(`${API_URL}/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();

      if (data.status !== "success") {
        setResetPasswordError(data.message);
      }

      setResetPasswordLoading(false);
      return data;
    } catch (error) {
      console.error("Error resetting password:", error);
      setResetPasswordError("Network error. Please try again.");
      setResetPasswordLoading(false);
      throw error;
    }
  };

  // const createShareableLink = async (shareData) => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const response = await fetch(`${API_URL}/api/share/create`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(shareData),
  //     });

  //     const data = await response.json();

  //     if (data.status !== "success") {
  //       setError(data.message);
  //       throw new Error(data.message);
  //     }

  //     setLoading(false);
  //     return data;
  //   } catch (error) {
  //     console.error("Create shareable link error:", error);
  //     setError("Failed to create shareable link. Please try again.");
  //     setLoading(false);
  //     throw error;
  //   }
  // };

  // const getSharedContent = async (slug) => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const response = await fetch(`${API_URL}/api/share/${slug}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     const data = await response.json();

  //     if (data.status !== "success") {
  //       setError(data.message);
  //       throw new Error(data.message);
  //     }

  //     setLoading(false);
  //     return data.data;
  //   } catch (error) {
  //     console.error("Get shared content error:", error);
  //     setError("Failed to load shared content.");
  //     setLoading(false);
  //     throw error;
  //   }
  // };

  // const getUserSharedContent = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const response = await fetch(`${API_URL}/api/share/my-shares`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const data = await response.json();

  //     if (data.status !== "success") {
  //       setError(data.message);
  //       throw new Error(data.message);
  //     }

  //     setLoading(false);
  //     return data.data;
  //   } catch (error) {
  //     console.error("Get user shared content error:", error);
  //     setError("Failed to load your shared content.");
  //     setLoading(false);
  //     throw error;
  //   }
  // };

  // const deleteSharedContent = async (slug) => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const response = await fetch(`${API_URL}/api/share/${slug}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const data = await response.json();

  //     if (data.status !== "success") {
  //       setError(data.message);
  //       throw new Error(data.message);
  //     }

  //     setLoading(false);
  //     return data;
  //   } catch (error) {
  //     console.error("Delete shared content error:", error);
  //     setError("Failed to delete shared content.");
  //     setLoading(false);
  //     throw error;
  //   }
  // };

  const loginWithGoogle = () => {
    return new Promise((resolve, reject) => {
      try {
        setError(null);
        setLoading(true);
        authSuccessRef.current = false;

        console.log("🚀 Initiating Google login");

        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const googleAuthUrl = `${API_URL}/api/auth/google`;
        console.log("🔗 Opening Google Auth URL:", googleAuthUrl);

        const popup = window.open(
          googleAuthUrl,
          "Google Login",
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`,
        );

        if (!popup) {
          setError("Popup blocked! Please allow popups.");
          setLoading(false);
          reject(new Error("Popup blocked"));
          return;
        }

        const handleMessage = (event) => {
          if (event.origin !== window.location.origin) {
            console.warn("⚠️ Message from wrong origin:", event.origin);
            return;
          }

          const { type, token, user, error } = event.data;
          console.log("📨 Received message:", type);

          if (type === "GOOGLE_AUTH_SUCCESS") {
            authSuccessRef.current = true;

            console.log("✅ Google auth successful");
            console.log("👤 User:", user);

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            setToken(token);
            setUser(user);
            setCredits(user.credits || 0);
            setAuthenticated(true);
            setLoading(false);

            if (popup && !popup.closed) {
              popup.close();
            }

            window.removeEventListener("message", handleMessage);
            resolve({ status: "success", user, token });
          } else if (type === "GOOGLE_AUTH_ERROR") {
            authSuccessRef.current = true;
            console.error("❌ Google auth error:", error);

            setError(error || "Google login failed");
            setLoading(false);

            if (popup && !popup.closed) {
              popup.close();
            }

            window.removeEventListener("message", handleMessage);
            reject(new Error(error || "Google login failed"));
          }
        };

        window.addEventListener("message", handleMessage);

        const checkPopupClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopupClosed);
            window.removeEventListener("message", handleMessage);
            setLoading(false);

            if (!authSuccessRef.current) {
              console.log("⚠️ Popup closed without auth");
              setError("Login cancelled");
              reject(new Error("Login cancelled"));
            }
          }
        }, 500);
      } catch (error) {
        console.error("❌ Google login error:", error);
        setError("Failed to initiate Google login");
        setLoading(false);
        reject(error);
      }
    });
  };

  const generateDesign = async (designData) => {
    try {
      setLoading(true);
      setError(null);
      let base64Image = null;
      if (
        designData.uploadedImage &&
        designData.uploadedImage.startsWith("blob:")
      ) {
        const fetchedBlob = await fetch(designData.uploadedImage);
        const blob = await fetchedBlob.blob();
        base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      }

      const response = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...designData,
          uploadedImage: base64Image,
        }),
      });

      const data = await response.json();

      if (data.needsPremium) {
        setLoading(false);
        return { needsPremium: true };
      }

      if (data.status === "success") {
        const newCredits =
          data.creditsLeft === "unlimited" ? Infinity : data.creditsLeft;
        setCredits(newCredits);
        const updatedUser = { ...user, credits: newCredits };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setLoading(false);
      return data;
    } catch (error) {
      setError("Generation failed. Please try again.");
      setLoading(false);
      throw error;
    }
  };
  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API_URL}/api/gallery`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.status === "success") {
        setGallery(data.gallery);
      }
    } catch (error) {
      console.error("Gallery fetch error:", error);
    }
  };
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        error,
        setError,
        authenticated,
        setAuthenticated,
        loading,
        setLoading,
        authLoading,
        projectcache,
        setProjectcache,
        signup,
        login,
        logout,
        updateProfile,
        deleteprofile,
        resetPasswordLoading,
        setResetPasswordLoading,
        resetPasswordError,
        setResetPasswordError,
        requestPasswordReset,
        verifyResetCode,
        resetPassword,
        // createShareableLink,
        // getSharedContent,
        // getUserSharedContent,
        // deleteSharedContent,
        loginWithGoogle,
        soulmateCache,
        setSoulmateCache,
        isPremium,
        premiumExpiryDate,
        activatePremium,
        credits,
        setCredits,
        generateDesign,
        gallery,
        fetchGallery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export default AppProvider;
