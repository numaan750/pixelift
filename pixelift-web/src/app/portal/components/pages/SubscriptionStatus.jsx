"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  CreditCard,
  RefreshCw,
  Zap,
  AlertCircle,
} from "lucide-react";
import { AppContext } from "@/context/Appcontext";
import { SUPPORT_EMAIL } from "@/lib/site";

const EVENT_LABELS = {
  "checkout.completed": "Checkout Completed",
  "subscription.active": "Subscription Active",
  "subscription.trialing": "Trial Started",
  "subscription.canceled": "Subscription Canceled",
  "subscription.scheduled_cancel": "Cancellation Scheduled",
  "subscription.paid": "Payment Collected",
  "subscription.expired": "Subscription Expired",
  "subscription.unpaid": "Payment Failed",
  "subscription.update": "Subscription Updated",
  "subscription.past_due": "Payment Past Due",
  "subscription.paused": "Subscription Paused",
  "refund.created": "Refund Created",
  "dispute.created": "Dispute Opened",
};

const EVENT_MESSAGES = {
  "checkout.completed":
    "Creem marked the checkout as completed. Pixelift now waits for the subscription lifecycle event that confirms ongoing access.",
  "subscription.active":
    "The subscription is active and premium access should remain available until the current billing period ends.",
  "subscription.trialing":
    "The subscription is in trial mode. Premium access stays available during the trial period.",
  "subscription.canceled":
    "The subscription was canceled immediately. Premium access is turned off unless a new checkout is completed.",
  "subscription.scheduled_cancel":
    "Auto-renewal is turned off. Premium access remains active until the end of the current paid period.",
  "subscription.paid":
    "A recurring payment succeeded and the subscription remains in good standing.",
  "subscription.expired":
    "The subscription period ended and premium access has expired.",
  "subscription.unpaid":
    "The latest charge failed. Access is preserved for now, but billing needs attention before the subscription expires.",
  "subscription.update":
    "Creem updated the subscription details. If the billing period changed, Pixelift refreshed the expiry date from the webhook payload.",
  "subscription.past_due":
    "The subscription is past due. Premium may still be active temporarily, but payment needs to be resolved.",
  "subscription.paused":
    "The subscription is paused and premium access is currently disabled.",
  "refund.created":
    "A refund was created for a Creem payment. This is recorded in billing history without forcing a subscription state change by itself.",
  "dispute.created":
    "A payment dispute was opened. This is recorded in billing history and may require manual review.",
};

function formatEventLabel(value) {
  if (!value) return "Pending";
  return (
    EVENT_LABELS[value] ||
    value
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

function formatExpiryDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function SubscriptionStatus({ handleSectionChange }) {
  const {
    isPremium,
    premiumExpiryDate,
    cancelPremiumSubscription,
    syncPremiumStatus,
    user,
  } = useContext(AppContext);

  const [checking, setChecking] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const loadedOnceRef = useRef(false);

  const expiryText = useMemo(
    () => formatExpiryDate(premiumExpiryDate),
    [premiumExpiryDate],
  );
  const currentStatus =
    user?.creemSubscriptionStatus ||
    (isPremium ? "subscription.active" : "Pending");
  const latestEvent = user?.creemLastEventType || currentStatus;
  const currentStatusLabel = formatEventLabel(currentStatus);
  const latestEventLabel = formatEventLabel(latestEvent);
  const latestEventMessage =
    EVENT_MESSAGES[latestEvent] ||
    "Pixelift recorded the latest Creem webhook event and stored it in your billing history.";

  useEffect(() => {
    if (loadedOnceRef.current) return;
    loadedOnceRef.current = true;
    let cancelled = false;

    const checkStatus = async () => {
      try {
        const result = await syncPremiumStatus();
        if (cancelled) return;
        setChecking(false);
        if (result?.status !== "success") {
          setError(result?.message || "Unable to refresh billing status.");
          return;
        }
        setError("");
      } catch {
        if (!cancelled) {
          setChecking(false);
          setError("Unable to refresh billing status.");
        }
      }
    };

    checkStatus();
    return () => {
      cancelled = true;
    };
  }, [syncPremiumStatus]);

  useEffect(() => {
    if (isPremium) {
      localStorage.removeItem("pendingPremiumCheckout");
      localStorage.removeItem("pendingPremiumCheckoutPlan");
    }
  }, [isPremium]);

  return (
    <div className="max-w-full space-y-6 text-white">
      <div className="rounded-3xl border border-[#ABD8FC80] bg-[#1D2933] p-6 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3B7FFF]">
          Subscription Controls
        </p>

        <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl md:text-5xl font-bold">
            {isPremium ? "Premium is Active" : "No Active Plan"}
          </h1>
          <div
            className={`self-start md:self-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              isPremium
                ? "bg-[#2CAA7820] text-[#2CAA78] border border-[#2CAA7840]"
                : "bg-[#3B7FFF20] text-[#3B7FFF] border border-[#3B7FFF40]"
            }`}
          >
            {isPremium ? <CheckCircle2 size={16} /> : <Clock3 size={16} />}
            <span>
              {isPremium ? "Confirmed" : checking ? "Checking..." : "Pending"}
            </span>
          </div>
        </div>

        <p className="mt-4 text-sm md:text-base text-[#F3F3F3CC] leading-7 max-w-2xl">
          {isPremium
            ? "Your premium plan is active. Webhook confirmation has reached Pixelift and premium access is enabled on your account."
            : "Complete your Creem checkout. This page checks your status once when it opens — use Refresh Status any time after the webhook updates your account."}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#ABD8FC30] bg-[#1D2933] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#3B7FFF20] flex items-center justify-center">
              <CreditCard size={16} className="text-[#3B7FFF]" />
            </div>
            <h2 className="font-semibold text-lg">Subscription</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-[#ABD8FC15]">
              <span className="text-sm text-[#F3F3F3CC]">Plan</span>
              <span className="text-sm font-semibold capitalize">
                {isPremium ? "Premium" : "Free"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#ABD8FC15]">
              <span className="text-sm text-[#F3F3F3CC]">Status</span>
              <span
                className={`text-sm font-semibold ${
                  isPremium ? "text-[#2CAA78]" : "text-[#F3F3F3CC]"
                }`}
              >
                {currentStatusLabel}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#ABD8FC15]">
              <span className="text-sm text-[#F3F3F3CC]">Latest Event</span>
              <span className="text-sm font-semibold">{latestEventLabel}</span>
            </div>
            {expiryText && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-[#F3F3F3CC]">Valid Until</span>
                <span className="text-sm font-semibold text-[#2CAA78]">
                  {expiryText}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-[#ABD8FC30] bg-[#1D2933] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#2CAA7820] flex items-center justify-center">
              <RefreshCw size={16} className="text-[#2CAA78]" />
            </div>
            <h2 className="font-semibold text-lg">Webhook Guidance</h2>
          </div>
          <div className="space-y-3 text-sm text-[#F3F3F3CC] leading-6">
            <p>{latestEventMessage}</p>
            <p className="pt-1 border-t border-[#ABD8FC15]">
              Use Refresh Status after Creem sends a new webhook if the portal
              still shows an older event.
            </p>
            <p className="pt-1 border-t border-[#ABD8FC15]">
              Open Payment History for the complete event timeline, including
              refunds, disputes, and renewal attempts.
            </p>
          </div>
        </div>
      </div>
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 flex items-center gap-3">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="rounded-2xl border border-[#2CAA78]/30 bg-[#2CAA78]/10 px-4 py-3 flex items-center gap-3">
          <CheckCircle2 size={16} className="text-[#2CAA78] flex-shrink-0" />
          <p className="text-sm text-[#2CAA78]">{successMessage}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={async () => {
            setChecking(true);
            setError("");
            try {
              await syncPremiumStatus();
            } catch {
              setError("Unable to refresh billing status.");
            } finally {
              setChecking(false);
            }
          }}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] px-5 py-2.5 text-sm font-semibold text-white"
        >
          <RefreshCw size={15} className={checking ? "animate-spin" : ""} />
          <span>Refresh Status</span>
        </button>
        {handleSectionChange && (
          <button
            onClick={() => handleSectionChange("payment-history")}
            className="inline-flex items-center gap-2 rounded-full border border-[#ABD8FC30] bg-[#12171B] px-5 py-2.5 text-sm font-semibold text-white hover:border-[#3B7FFF] transition"
          >
            Payment History
          </button>
        )}
        {handleSectionChange && (
          <button
            onClick={() => handleSectionChange("view-pricing")}
            className="inline-flex items-center gap-2 rounded-full border border-[#ABD8FC30] bg-[#12171B] px-5 py-2.5 text-sm font-semibold text-white hover:border-[#2CAA78] transition"
          >
            View Pricing
          </button>
        )}
        {isPremium && user?.creemSubscriptionId ? (
          <button
            onClick={async () => {
              const confirmed = window.confirm(
                "Cancel auto-renewal for your Creem subscription? Current paid time remains active until the end date.",
              );
              if (!confirmed) return;
              setCancelling(true);
              setError("");
              setSuccessMessage("");
              try {
                const result = await cancelPremiumSubscription();
                if (result?.status === "success") {
                  setSuccessMessage(
                    result?.message ||
                      "Subscription cancellation requested successfully.",
                  );
                  await syncPremiumStatus();
                } else {
                  setError(
                    result?.message ||
                      "Unable to cancel subscription right now.",
                  );
                }
              } catch {
                setError("Unable to cancel subscription right now.");
              } finally {
                setCancelling(false);
              }
            }}
            disabled={cancelling}
            className="inline-flex items-center gap-2 rounded-full border border-red-500/40 px-5 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
          >
            {cancelling ? "Cancelling..." : "Cancel Auto-Renewal"}
          </button>
        ) : !isPremium ? (
          <button
            onClick={() => window.open("https://billing.creem.io", "_blank")}
            className="inline-flex items-center gap-2 rounded-full border border-[#3B7FFF40] bg-[#3B7FFF15] px-5 py-2.5 text-sm font-semibold text-[#3B7FFF] hover:bg-[#3B7FFF25] transition"
          >
            <Zap size={15} />
            Upgrade to Premium
          </button>
        ) : null}
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="inline-flex items-center gap-2 rounded-full border border-[#ABD8FC30] bg-[#12171B] px-5 py-2.5 text-sm font-semibold text-[#F3F3F3CC] hover:border-[#ABD8FC60] transition"
        >
          {SUPPORT_EMAIL}
        </a>
      </div>

      {!isPremium && (
        <p className="text-sm text-[#F3F3F3CC] leading-6">
          Complete your payment in Creem, then return here and refresh your
          status after the webhook updates your account.
        </p>
      )}
    </div>
  );
}
