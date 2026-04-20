"use client";
import { PUBLIC_PRICING } from "@/lib/site";

export default function PortalPricingPage() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Choose Your Plan
        </h1>
        <p className="text-[13px] sm:text-[15px] text-[#F3F3F3CC] max-w-xl mx-auto leading-relaxed">
          Transparent premium pricing for Pixelift. Plans auto-renew until you
          cancel anytime from Subscription Status.
        </p>
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
        {PUBLIC_PRICING.map((plan, index) => {
          const isPopular = index === 0;

          return (
            <article
              key={plan.id}
              className={`relative rounded-2xl border p-5 sm:p-6 flex flex-col gap-4
                ${
                  isPopular
                    ? "border-[#3B7FFF] bg-gradient-to-b from-[#1D2933] to-[#12171B] shadow-lg"
                    : "border-[#AABFFF]/30 bg-[#1D2933] hover:border-[#3B7FFF]/50"
                }`}
            >
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] px-3 py-1 rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-semibold whitespace-nowrap">
                  Most Popular
                </span>
              )}

              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                {plan.name}
              </p>

              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white leading-none">
                  {plan.price}
                </h2>
                <p className="text-[#F3F3F3CC] text-sm mt-1">{plan.cadence}</p>
              </div>

              <p className="text-white font-medium text-sm sm:text-base">
                {plan.summary}
              </p>

              <p className="text-[#F3F3F3CC] text-sm leading-relaxed">
                {plan.renewal}
              </p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
