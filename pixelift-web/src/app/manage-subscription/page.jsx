import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { us } from "@/app/constants/us";
import { APP_SUBSCRIPTIONS_URL, SUPPORT_EMAIL } from "@/lib/site";

export const metadata = {
  title: "Manage PixelLift Subscription – Billing and Cancellation Help",
  description:
    "Manage or cancel your PixelLift subscription, open Apple subscription controls, and get billing support for your account.",
};

export default function ManageSubscriptionPage() {
  return (
    <>
      <Navbar navLinks={us.navLinks} country="us" />
      <main className="bg-[#12171B] text-white">
        <div className="mycontainer py-18 md:py-20">
          <div className="max-w-full space-y-10">
            <header className="space-y-4 border-b border-white/10 pb-8">
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-br from-[#3B7FFF] to-[#2CAA78]">
                Subscription Controls
              </p>
              <h1 className="text-[30px] sm:text-[40px] md:text-[48px] font-bold leading-tight">
                Manage or Cancel Your Subscription
              </h1>
              <p className="text-[16px] sm:text-[18px] leading-8 text-white">
                PixelLift makes subscription management visible and accessible.
                If you subscribed through the iOS app, Apple handles billing,
                renewals, and cancellation directly.
              </p>
            </header>

            <section className="rounded-3xl border border-zinc-800 bg-gradient-to-r from-[#3B7FFF]/10 to-[#2CAA78]/10 p-6 md:p-8 space-y-5">
              <h2 className="text-2xl font-bold">
                For iPhone and iPad subscriptions
              </h2>
              <p className="text-[16px] leading-8 text-white">
                Open Apple Subscriptions to review your active plan, switch
                plans, or cancel renewal. Changes are handled by Apple for App
                Store purchases.
              </p>
              <a
                href={APP_SUBSCRIPTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-[14px] rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] px-5 py-3 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Open Apple Subscriptions
              </a>
            </section>
            <section className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-zinc-800 bg-gradient-to-r from-[#3B7FFF]/10 to-[#2CAA78]/10 p-6 space-y-3">
                <h2 className="text-2xl font-bold">Need billing help?</h2>
                <p className="text-[16px] leading-8 text-white">
                  If you cannot access your subscription controls or need help
                  matching a purchase to your account, contact support.
                </p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="inline-flex rounded-full border border-[#3B7FFF]/40 px-5 py-3 text-[#3B7FFF] font-medium hover:text-[#2CAA78] hover:border-[#2CAA78] transition-colors"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
              <div className="rounded-3xl border border-zinc-800 bg-gradient-to-r from-[#3B7FFF]/10 to-[#2CAA78]/10 p-6 space-y-3">
                <h2 className="text-2xl font-bold">Before you cancel</h2>
                <p className="text-[16px] leading-8 text-white">
                  Cancelling stops future renewals. Any remaining paid period
                  stays active until the end of the current billing term.
                </p>
                <p className="text-[16px] leading-8 text-white">
                  For current pricing and plan details, review our pricing page
                  before changing your subscription.
                </p>
                <div className="flex flex-wrap gap-3 pt-2 text-sm font-semibold">
                  <Link
                    href="/pricing"
                    className="rounded-full border border-[#3B7FFF]/40 px-4 py-2 text-[#3B7FFF] hover:text-[#2CAA78] hover:border-[#2CAA78] transition-colors"
                  >
                    Pricing Details
                  </Link>
                  <Link
                    href="/conditions"
                    className="rounded-full border border-[#3B7FFF]/40 px-4 py-2 text-[#3B7FFF] hover:text-[#2CAA78] hover:border-[#2CAA78] transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer footer={us.footer} country="us" supportEmail={SUPPORT_EMAIL} />
    </>
  );
}
