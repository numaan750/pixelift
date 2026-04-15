"use client";
import Link from "next/link";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { altFromSrcOrAlt } from "@/lib/altText";

const Footer = ({ footer, country }) => {
  const pathname = usePathname();

  const title = footer?.title ?? "Soulmate Art";

  const privacyLabel =
    footer?.page1 ??
    footer?.links?.find((l) => /privacy|privac/i.test(l?.label ?? ""))?.label ??
    "Privacy Policy";

  const termsLabel =
    footer?.page2 ??
    footer?.links?.find((l) => /terms|condition/i.test(l?.label ?? ""))
      ?.label ??
    "Terms & Conditions";

  const footerText = footer?.text ?? footer?.copyright ?? footer?.description;

  const handleHomeClick = (e) => {
    e.preventDefault();

    if (pathname === "/") {
      scrollToSection("home");
    } else {
      router.push("/");

      setTimeout(() => {
        scrollToSection("home");
      }, 300);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    const navbarHeight = 80;
    const y =
      element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };
  const handleFooterClick = (e, targetId) => {
    e.preventDefault();

    const element = document.getElementById(targetId);
    if (element) {
      const navbarHeight = 80; // same offset
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-gradient-to-r from-[#3B7FFF]/10 to-[#2CAA78]/10 bg-[#12171B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
            <Image
              src="/home-images/pixellift.png"
              alt={altFromSrcOrAlt({ alt: "pixellift", locale: country })}
              width={48}
              height={48}
              className="rounded-xl"
            />
          </div>

          <p className="text-[24px] sm:text-[30px] md:text-[40px] font-bold">
            {footer?.title}
          </p>

          <nav className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-[16px] sm:text-[18px]">
            <Link
              href="/privecypolice"
              className="hover:text-blue-400 transition-colors"
            >
              {privacyLabel}
            </Link>

            <Link
              href="/conditions"
              className="hover:text-blue-400 transition-colors"
            >
              {termsLabel}
            </Link>
            <Link
              href="/blog"
              className="hover:text-blue-400 transition-colors"
            >
              Blog
            </Link>
          </nav>

          <p className="text-[16px] sm:text-[18px] text-white max-w-xs sm:max-w-md">
            {footerText}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

