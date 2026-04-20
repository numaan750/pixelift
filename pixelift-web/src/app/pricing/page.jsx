import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { us } from "@/app/constants/us";
import {
  APP_SUBSCRIPTIONS_URL,
  PUBLIC_PRICING,
  SUPPORT_EMAIL,
} from "@/lib/site";

export const metadata = {
  title: "PixelLift Pricing – AI Photo Enhancement Subscription Plans",
  description:
    "Review PixelLift pricing, renewal terms, cancellation details, and subscription options for AI photo enhancement and upscaling features.",
};

function parsePriceAmount(price) {
  const normalized = String(price || "").replace(/[^0-9.]/g, "");
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : undefined;
}

export default function PricingPage() {
  return (
    <>
      <Navbar navLinks={us.navLinks} country="us" />
      <main className="bg-[#12171B] text-white">
        <div className="mycontainer py-18 md:py-20">
          <div className="space-y-10">
            {/* Header */}
            <header className="space-y-4 border-b border-white/10 pb-8">
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-br from-[#3B7FFF] to-[#2CAA78]">
                Billing Transparency
              </p>
              <h1 className="text-[30px] sm:text-[40px] md:text-[48px] font-bold leading-tight">
                PixelLift Pricing
              </h1>
              <p className="text-[16px] sm:text-[18px] leading-8 text-white max-w-full">
                PixelLift offers transparent premium pricing for AI-powered
                photo enhancement and upscaling. Plans renew automatically until
                cancelled, and subscription management is available through
                Apple Subscriptions for iOS purchases.
              </p>
            </header>

            <section className="grid gap-6 md:grid-cols-2">
              {PUBLIC_PRICING.map((plan) => (
                <article
                  key={plan.id}
                  className="rounded-3xl border border-zinc-800 bg-gradient-to-r from-[#3B7FFF]/10 to-[#2CAA78]/10 p-6 shadow-sm hover:border-[#3B7FFF]/40 transition-colors"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-transparent bg-clip-text bg-gradient-to-br from-[#3B7FFF] to-[#2CAA78]">
                    {plan.name}
                  </p>
                  <div className="mt-4 space-y-2">
                    <h2 className="text-3xl font-bold text-white">
                      {plan.price}
                    </h2>
                    <p className="text-white/70">{plan.cadence}</p>
                    <p className="text-white font-medium">{plan.summary}</p>
                    <p className="text-white/70">{plan.renewal}</p>
                  </div>
                </article>
              ))}
            </section>
            <section className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-zinc-800 bg-gradient-to-r from-[#3B7FFF]/10 to-[#2CAA78]/10 p-6 space-y-4">
                <h2 className="text-2xl font-bold">Renewal and Cancellation</h2>
                <p className="text-[16px] leading-8 text-white">
                  Premium plans renew automatically on the same billing cadence
                  unless cancelled before the next renewal date.
                </p>
                <p className="text-[16px] leading-8 text-white">
                  If your subscription was purchased through the iOS app, use
                  Apple&apos;s subscription controls to cancel or manage it at
                  any time.
                </p>
                <a
                  href={APP_SUBSCRIPTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] px-5 py-3 text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Open Apple Subscriptions
                </a>
                <div className="flex flex-wrap gap-3 pt-2 text-sm font-semibold">
                  <Link
                    href="/manage-subscription"
                    className="rounded-full border border-[#3B7FFF]/40 px-4 py-2 text-[#3B7FFF] hover:text-[#2CAA78] hover:border-[#2CAA78] transition-colors"
                  >
                    Manage Subscription
                  </Link>
                  <Link
                    href="/blog"
                    className="rounded-full border border-[#3B7FFF]/40 px-4 py-2 text-[#3B7FFF] hover:text-[#2CAA78] hover:border-[#2CAA78] transition-colors"
                  >
                    Read the Blog
                  </Link>
                </div>
              </div>
              <div className="rounded-3xl border border-zinc-800 bg-gradient-to-r from-[#3B7FFF]/10 to-[#2CAA78]/10 p-6 space-y-4">
                <h2 className="text-2xl font-bold">Billing Support</h2>
                <p className="text-[16px] leading-8 text-white">
                  For account access issues, billing questions, or support
                  requests, email our support team.
                </p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="inline-flex rounded-full border border-[#3B7FFF]/40 px-5 py-3 text-[#3B7FFF] font-medium hover:text-[#2CAA78] hover:border-[#2CAA78] transition-colors"
                >
                  {SUPPORT_EMAIL}
                </a>
                <p className="text-sm text-white">
                  Final billing currency and taxes are shown during checkout and
                  may vary based on your purchase channel or region.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer footer={us.footer} country="us" supportEmail={SUPPORT_EMAIL} />
    </>
  );
}
