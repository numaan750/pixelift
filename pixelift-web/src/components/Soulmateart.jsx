"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaApple } from "react-icons/fa";
import { altFromSrcOrAlt } from "@/lib/altText";

const SoulmateArt = ({ soulmateArt, country }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handlePortalClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      router.push("/portal/dashboard");
    } else {
      router.push("/portal/login?mode=signup");
    }
  };
  const ratingCount = soulmateArt?.ratingCount ?? 137;

  const imageSrc =
    soulmateArt?.img ||
    soulmateArt?.features?.[0]?.image ||
    "/home-images/Discover-Everything-in-Soulmate-Art.webp";

  const imageAlt = altFromSrcOrAlt({
    alt: soulmateArt?.alt || soulmateArt?.features?.[0]?.alt,
    src: imageSrc,
    locale: country,
  });

  const text1 = soulmateArt?.text1 ?? "User Satisfaction";
  const text2 = soulmateArt?.text2 ?? "Rating out of 5";

  return (
    <div id="apps" className="bg-[#12171B] text-white ">
      <div className="mycontainer py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <h2 className="text-[24px] sm:text-[30px] md:text-[45px] font-bold leading-tight">
              {soulmateArt?.title ?? "Discover Everything in Soulmate Art"}
            </h2>

            <p className="text-white text-[16px] sm:text-[18px] max-w-md">
              {soulmateArt?.description}
            </p>

            <div className="flex gap-4 flex-wrap">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handlePortalClick}
                  className="relative group cursor-pointer overflow-hidden inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-medium px-5 sm:px-6 py-3 rounded-full w-fit"
                >
                  <span className="relative z-10 text-[14px] sm:text-[16px]">
                    {isLoggedIn ? "Dashboard" : "Get Started"}
                  </span>
                  <span className="absolute inset-0 -translate-x-full -translate-y-full group-hover:translate-x-full group-hover:translate-y-full transition-transform duration-700 bg-gradient-to-br from-transparent via-white/20 to-transparent" />
                </button>

                <a
                  href="https://apps.apple.com/us/app/pixelift-ai-photo-enhancer/id6748871047"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="relative group cursor-pointer overflow-hidden inline-flex items-center justify-center gap-2 bg-[#12171B] text-white border border-white/20 font-medium px-5 sm:px-6 py-3 rounded-full w-fit hover:bg-neutral-900 transition">
                    <FaApple className="relative z-10 text-lg" />
                    <span className="relative z-10 text-[14px] sm:text-[16px] whitespace-nowrap">
                      Get the App
                    </span>
                    <span className="absolute inset-0 -translate-x-full -translate-y-full group-hover:translate-x-full group-hover:translate-y-full transition-transform duration-700 bg-gradient-to-br from-transparent via-white/20 to-transparent" />
                  </button>
                </a>
              </div>
            </div>

            <div className="flex gap-12 pt-4">
              <div>
                <div className="text-5xl font-bold">
                  95<span className="text-3xl">%</span>
                </div>
                <div className="text-gray-400 mt-2">{text1}</div>
              </div>
              <div>
                <div className="text-5xl font-bold">4.7</div>
                <div className="text-gray-400 mt-2">{text2}</div>
                <div className="text-gray-400 mt-1">{ratingCount} ratings</div>
              </div>
            </div>
          </div>
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-3xl aspect-[4/5] order-1 lg:order-2">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoulmateArt;
