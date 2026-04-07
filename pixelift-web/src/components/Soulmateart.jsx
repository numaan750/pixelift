"use client";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import { altFromSrcOrAlt } from "@/lib/altText";

const SoulmateArt = ({ soulmateArt, country }) => {
  const pathname = usePathname();
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
              <a
                href="https://apps.apple.com/us/app/pixelift-ai-photo-enhancer/id6748871047"
                target="blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/home-images/App-Store.png"
                  alt={altFromSrcOrAlt({
                    alt: "App-Store.png",
                    locale: country,
                  })}
                  width={180}
                  height={60}
                  className="h-11 md:h-12 w-auto cursor-pointer"
                />
              </a>
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
