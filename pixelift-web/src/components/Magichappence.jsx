"use client";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { altFromSrcOrAlt } from "@/lib/altText";

const Magichappence = ({ magicHappens, country }) => {
  const pathname = usePathname();
  return (
    <section id="how-it-works" className="bg-[#12171B] text-white">
      <div className="mycontainer py-10">
        <div className="flex flex-col items-center gap-3 sm:gap-4 text-center mb-3 sm:mb-14">
          <h2 className="text-[24px] sm:text-[30px] md:text-[40px] font-bold">
            {magicHappens?.title}
          </h2>
          <p className="text-[16px] sm:text-[18px] max-w-xl text-white">
            {magicHappens?.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12 py-6">
          <div className="max-w-2xl order-2 md:order-1">
            <span className="inline-block mb-3 px-2 py-1 text-[14px] font-semibold bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white rounded-full">
              {magicHappens?.step1?.tag}
            </span>
            <h3 className="text-[24px] sm:text-[36px] font-semibold mb-4">
              {magicHappens?.step1?.title}
            </h3>
            <p className="text-[#CCCCCC] leading-relaxed text-[16px] sm:text-[18px]">
              {magicHappens?.step1?.description}
            </p>
          </div>

          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <Image
              src={magicHappens?.step1?.image}
              alt={altFromSrcOrAlt({
                alt: magicHappens?.step1?.alt,
                src: magicHappens?.step1?.image,
                locale: country,
              })}
              width={800}
              height={600}
              className="w-full max-w-md sm:max-w-xl rounded-2xl opacity-90"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12 py-10">
          <div className="flex justify-center md:justify-start md:order-1">
            <Image
              src={magicHappens?.step2?.image}
              alt={altFromSrcOrAlt({
                alt: magicHappens?.step2?.alt,
                src: magicHappens?.step2?.image,
                locale: country,
              })}
              width={800}
              height={600}
              className="w-full max-w-md sm:max-w-xl rounded-2xl opacity-90"
            />
          </div>

          <div className="max-w-2xl md:order-2 md:ml-auto">
            <span className="inline-block mb-3 px-2 py-1 text-[14px] font-semibold bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white rounded-full">
              {magicHappens?.step2?.tag}
            </span>
            <h3 className="text-[24px] sm:text-[36px] font-semibold mb-4">
              {magicHappens?.step2?.title}
            </h3>
            <p className="text-[#CCCCCC] leading-relaxed text-[16px] sm:text-[18px]">
              {magicHappens?.step2?.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12 py-10">
          <div className="max-w-2xl order-2 md:order-1">
            <span className="inline-block mb-3 px-2 py-1 text-[14px] font-semibold bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white rounded-full">
              {magicHappens?.step3?.tag}
            </span>
            <h3 className="text-[24px] sm:text-[36px] font-semibold mb-4">
              {magicHappens?.step3?.title}
            </h3>
            <p className="text-[#CCCCCC] leading-relaxed text-[16px] sm:text-[18px]">
              {magicHappens?.step3?.description}
            </p>
          </div>

          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <Image
              src={magicHappens?.step3?.image}
              alt={altFromSrcOrAlt({
                alt: magicHappens?.step3?.alt,
                src: magicHappens?.step3?.image,
                locale: country,
              })}
              width={800}
              height={600}
              className="w-full max-w-md sm:max-w-xl rounded-2xl opacity-90"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Magichappence;

