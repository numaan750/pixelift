"use client";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/Appcontext";

const EVENT_LABELS = {
  "checkout.completed": "Checkout Completed",
  "subscription.active": "Subscription Active",
  "subscription.paid": "Payment Collected",
  "subscription.canceled": "Subscription Canceled",
  "subscription.expired": "Subscription Expired",
  "checkout.opened": "Checkout Opened",
};

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

const PaymentHistory = () => {
  const { fetchPaymentHistory, paymentHistory } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        await fetchPaymentHistory();
      } catch {
        setError("Unable to load payment history.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="text-white p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">Payment History</h2>
        <p className="text-sm text-gray-400">Your Creem billing events</p>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && paymentHistory.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No payment events found</p>
          <p className="text-sm mt-2">
            Events will appear here after your first payment
          </p>
        </div>
      )}

      {!loading && paymentHistory.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-[#ABD8FC80]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#ABD8FC80] text-gray-400">
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Event</th>
                <th className="text-left px-4 py-3">Plan</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Source</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((entry, index) => (
                <tr
                  key={index}
                  className="border-b border-[#ABD8FC80] hover:bg-[#1D2933] transition"
                >
                  <td className="px-4 py-3">{formatDate(entry.timestamp)}</td>
                  <td className="px-4 py-3 font-medium">
                    {EVENT_LABELS[entry.eventType] || entry.eventType || "-"}
                  </td>
                  <td className="px-4 py-3 capitalize">{entry.plan || "-"}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-[#2CAA7820] text-[#2CAA78]">
                      {entry.status || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {entry.source || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
