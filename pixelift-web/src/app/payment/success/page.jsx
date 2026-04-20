"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppContext } from "@/context/Appcontext";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const {
    token,
    setIsPremium,
    setPremiumExpiryDate,
    user,
    setUser,
    syncPremiumStatus,
  } = useContext(AppContext);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!token || checked) return;
    setChecked(true);

    const poll = async (attempts = 0) => {
      if (attempts > 10) {
        router.replace("/dashboard");
        return;
      }
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/premium/status`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (data.isPremium) {
          setIsPremium(true);
          setPremiumExpiryDate(new Date(data.premiumExpiryDate));
          localStorage.setItem("isPremium", "true");
          localStorage.setItem("premiumExpiryDate", data.premiumExpiryDate);
          if (user) {
            const updated = {
              ...user,
              isPremium: true,
              premiumExpiryDate: data.premiumExpiryDate,
            };
            setUser(updated);
            localStorage.setItem("user", JSON.stringify(updated));
          }
          await syncPremiumStatus();
          router.replace("/dashboard");
        } else {
          setTimeout(() => poll(attempts + 1), 2000);
        }
      } catch {
        setTimeout(() => poll(attempts + 1), 2000);
      }
    };

    poll();
  }, [token]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#12171B",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "sans-serif",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(to right, #3B7FFF, #2CAA78)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
        }}
      >
        ✓
      </div>
      <h2 style={{ margin: 0, fontWeight: 600 }}>Payment Successful!</h2>
      <p style={{ color: "#aaa", margin: 0 }}>Activating your {plan} plan...</p>
      <div
        style={{
          width: 32,
          height: 32,
          border: "3px solid #3B7FFF",
          borderTopColor: "transparent",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
