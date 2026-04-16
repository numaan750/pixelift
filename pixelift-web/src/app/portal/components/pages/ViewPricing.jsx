"use client";
import { PUBLIC_PRICING } from "@/lib/site";

export default function PortalPricingPage() {
  return (
    <div className=" mx-auto space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-white">Choose Your Plan</h1>
        <p className="text-[15px] text-[#F3F3F3CC] max-w-xl mx-auto">
          Transparent premium pricing for Pixelift. Plans auto-renew until you
          cancel anytime from Subscription Status.
        </p>
      </div>
      <section className="grid gap-8 md:grid-cols-2 items-stretch">
        {PUBLIC_PRICING.map((plan, index) => {
          const isPopular = index === 0;

          return (
            <article
              key={plan.id}
              className={`relative rounded-3xl border p-6 flex flex-col justify-between
              ${
                isPopular
                  ? "border-[#3B7FFF] bg-gradient-to-b from-[#1D2933] to-[#12171B] scale-105 shadow-lg"
                  : "border-[#AABFFF]/30 bg-[#1D2933] hover:border-[#3B7FFF]/50"
              }`}
            >
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-semibold">
                  Most Popular
                </span>
              )}
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
                  {plan.name}
                </p>
                <div>
                  <h2 className="text-4xl font-bold text-white">
                    {plan.price}
                  </h2>
                  <p className="text-[#F3F3F3CC] text-sm">{plan.cadence}</p>
                </div>
                <p className="text-white font-medium">{plan.summary}</p>
                <p className="text-[#F3F3F3CC] text-sm">{plan.renewal}</p>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
