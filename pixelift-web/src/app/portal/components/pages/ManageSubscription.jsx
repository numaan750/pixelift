"use client";
import { SUPPORT_EMAIL } from "@/lib/site";

export default function ManageSubscription({ handleSectionChange }) {
  return (
    <div className="max-w-full space-y-8 text-white">
      <div className="rounded-3xl border border-[#ABD8FC80] bg-[#1D2933] p-6 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3B7FFF]">
          Portal Subscription Controls
        </p>
        <h1 className="mt-3 text-3xl md:text-5xl font-bold">
          Manage Your Subscription
        </h1>
        <p className="mt-4 text-sm md:text-base text-[#F3F3F3CC] leading-7 max-w-2xl">
          Access all billing tools, view pricing, check subscription status, and
          manage auto-renew settings from one place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          onClick={() => handleSectionChange("view-pricing")}
          className="group rounded-2xl border border-[#ABD8FC30] bg-[#12171B] p-5 transition-all hover:border-[#3B7FFF] text-left"
        >
          <h3 className="font-semibold text-lg group-hover:text-[#3B7FFF] transition">
            View Pricing
          </h3>
          <p className="text-sm text-[#F3F3F3CC] mt-1">
            Compare all available Pixelift plans
          </p>
        </button>

        <button
          onClick={() => handleSectionChange("subscription-status")}
          className="group rounded-2xl border border-[#ABD8FC30] bg-[#12171B] p-5 transition-all hover:border-[#2CAA78] text-left"
        >
          <h3 className="font-semibold text-lg group-hover:text-[#2CAA78] transition">
            Subscription Status & Cancel
          </h3>
          <p className="text-sm text-[#F3F3F3CC] mt-1">
            View active plan and manage cancellation
          </p>
        </button>

        <button
          onClick={() => handleSectionChange("payment-history")}
          className="group rounded-2xl border border-[#ABD8FC30] bg-[#12171B] p-5 transition-all hover:border-[#3B7FFF] text-left"
        >
          <h3 className="font-semibold text-lg group-hover:text-[#3B7FFF] transition">
            Payment History
          </h3>
          <p className="text-sm text-[#F3F3F3CC] mt-1">
            View all past transactions and invoices
          </p>
        </button>

        <button
          onClick={() => handleSectionChange("subscription-status")}
          className="group rounded-2xl border border-[#ABD8FC30] bg-[#12171B] p-5 transition-all hover:border-[#2CAA78] text-left"
        >
          <h3 className="font-semibold text-lg group-hover:text-[#2CAA78] transition">
            Open Billing Portal
          </h3>
          <p className="text-sm text-[#F3F3F3CC] mt-1">
            Manage subscription directly with Creem
          </p>
        </button>
      </div>

      <div className="rounded-3xl border border-[#ABD8FC30] bg-[#1D2933] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg">Need Help?</h3>
          <p className="text-sm text-[#F3F3F3CC]">
            Contact our support team anytime
          </p>
        </div>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-semibold"
        >
          {SUPPORT_EMAIL}
        </a>
      </div>
    </div>
  );
}
