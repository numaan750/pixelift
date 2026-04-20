import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { us } from "@/app/constants/us";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata = {
  title: "Acceptable Use Policy – PixelLift Content Safety Rules",
  description:
    "Read the PixelLift acceptable use policy and content safety rules for AI-powered photo enhancement and image upscaling tools.",
};

export default function AcceptableUsePage() {
  return (
    <>
      <Navbar navLinks={us.navLinks} country="us" />
      <main className="bg-[#12171B] text-white">
        <div className="mycontainer py-18 md:py-20">
          <div className="max-w-full space-y-10">
            <header className="space-y-4 border-b border-white/10 pb-8">
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-br from-[#3B7FFF] to-[#2CAA78]">
                Content Safety
              </p>
              <h1 className="text-[30px] sm:text-[40px] md:text-[48px] font-bold leading-tight">
                Acceptable Use Policy
              </h1>
              <p className="text-[16px] sm:text-[18px] leading-8 text-white">
                PixelLift is an independent AI-powered photo enhancement
                product. It helps users upscale, restore, and improve their
                images using advanced AI technology. We are not affiliated with
                Apple or any third-party model provider.
              </p>
            </header>

            {/* Allowed Use */}
            <section className="space-y-4">
              <h2 className="text-[24px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#3B7FFF] to-[#2CAA78]">
                Allowed Use
              </h2>
              <p className="text-[16px] leading-8 text-white">
                You may use PixelLift to enhance, upscale, restore, and improve
                photos and images you own or have rights to. This includes
                personal photos, artwork, and images for creative or
                professional purposes.
              </p>
            </section>

            {/* Prohibited Content */}
            <section className="space-y-4">
              <h2 className="text-[24px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#3B7FFF] to-[#2CAA78]">
                Prohibited Content
              </h2>
              <p className="text-[16px] leading-8 text-white">
                You may not use PixelLift to upload, enhance, or attempt to
                process content that is sexually explicit, nude, sexually
                suggestive, pornographic, exploitative, or otherwise NSFW.
              </p>
              <p className="text-[16px] leading-8 text-white">
                You also may not use the product for illegal, harmful,
                deceptive, abusive, hateful, violent, harassing, or
                privacy-invasive purposes, including attempts to process content
                involving minors or non-consensual intimate imagery.
              </p>
            </section>

            {/* Moderation */}
            <section className="space-y-4">
              <h2 className="text-[24px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#3B7FFF] to-[#2CAA78]">
                Moderation and Enforcement
              </h2>
              <p className="text-[16px] leading-8 text-white">
                Image processing requests are subject to automated checks.
                Uploads that appear to target sexual, explicit, or otherwise
                unsafe content may be blocked or refused. We may suspend access
                to accounts that attempt to bypass these safeguards.
              </p>
              <p className="text-[16px] leading-8 text-white">
                We reserve the right to review abuse reports, investigate
                suspicious activity, and remove content or disable accounts when
                necessary to protect users, payment partners, and the platform.
              </p>
            </section>

            {/* Questions */}
            <section className="space-y-4">
              <h2 className="text-[24px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#3B7FFF] to-[#2CAA78]">
                Questions
              </h2>
              <p className="text-[16px] leading-8 text-white">
                If you have questions about this policy or need support, contact
                us at{" "}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="underline text-[#3B7FFF] hover:text-[#2CAA78] transition-colors"
                >
                  {SUPPORT_EMAIL}
                </a>
                .
              </p>
              <div className="flex flex-wrap gap-3 pt-2 text-sm font-semibold">
                <Link
                  href="/privecypolice"
                  className="rounded-full border border-[#3B7FFF]/40 px-4 py-2 text-[#3B7FFF] hover:border-[#2CAA78] hover:text-[#2CAA78] transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/conditions"
                  className="rounded-full border border-[#3B7FFF]/40 px-4 py-2 text-[#3B7FFF] hover:border-[#2CAA78] hover:text-[#2CAA78] transition-colors"
                >
                  Terms & Conditions
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer footer={us.footer} country="us" supportEmail={SUPPORT_EMAIL} />
    </>
  );
}
