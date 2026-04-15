"use client";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/Appcontext";

const PaymentHistory = () => {
  const { isPremium, premiumExpiryDate } = useContext(AppContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Apna API call yahan lagao jo payment history fetch kare
  useEffect(() => {
    // Example: fetch("/api/payment-history").then(...)
    // Abhi dummy data hai
    setPayments([
      {
        id: "INV-001",
        date: "2025-03-01",
        amount: "$9.99",
        plan: "Pro Monthly",
        status: "Paid",
      },
      {
        id: "INV-002",
        date: "2025-02-01",
        amount: "$9.99",
        plan: "Pro Monthly",
        status: "Paid",
      },
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="text-white p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">Payment History</h2>
        <p className="text-sm text-gray-400">
          Aapke saare transactions yahan hain
        </p>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : payments.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">Koi payment nahi mili</p>
          <p className="text-sm mt-2">
            Jab aap koi plan lenge, yahan dikhega
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#ABD8FC80]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#ABD8FC80] text-gray-400">
                <th className="text-left px-4 py-3">Invoice</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Plan</th>
                <th className="text-left px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[#ABD8FC80] hover:bg-[#1D2933] transition"
                >
                  <td className="px-4 py-3 text-[#3B7FFF]">{p.id}</td>
                  <td className="px-4 py-3">{p.date}</td>
                  <td className="px-4 py-3">{p.plan}</td>
                  <td className="px-4 py-3">{p.amount}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-[#2CAA7820] text-[#2CAA78]">
                      {p.status}
                    </span>
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