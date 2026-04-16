"use client";
import { useRouter } from "next/navigation";

export default function PaymentCancel() {
  const router = useRouter();
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
          background: "#1D2933",
          border: "2px solid #555",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
        }}
      >
        ✕
      </div>
      <h2 style={{ margin: 0 }}>Payment Cancelled</h2>
      <p style={{ color: "#aaa", margin: 0 }}>
        No worries, you were not charged.
      </p>
      <button
        onClick={() => router.replace("/dashboard")}
        style={{
          padding: "10px 28px",
          background: "linear-gradient(to right, #3B7FFF, #2CAA78)",
          border: "none",
          borderRadius: 999,
          color: "white",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}