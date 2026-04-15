"use client";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import { altFromSrcOrAlt } from "@/lib/altText";
// import { MdOutlineArrowOutward } from "react-icons/md";

const Magicalcore = ({ magicalCore, country }) => {
  const pathname = usePathname();

  return (
    <section
      id="features"
      className="bg-[#12171B] text-white py-12 sm:py-14 md:py-16 relative overflow-hidden"
    >
      <div className="mycontainer flex flex-col gap-8 md:gap-10 relative z-10">
        <div className="flex flex-col items-center gap-3 sm:gap-4 text-center">
          <h2 className="text-[24px] sm:text-[30px] md:text-[40px] font-bold">
            {magicalCore?.title}
          </h2>
          <p className="text-[16px] sm:text-[18px] max-w-md sm:max-w-3xl text-white">
            {magicalCore?.description}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {magicalCore?.features?.map((feature, index) => (
            <div
              key={index}
              className="relative bg-[#1D2933] rounded-[50px] overflow-hidden cursor-pointer w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-10.67px)]"
            >
              <a href="/portal/login" className="w-full block">
                <div className="relative w-full aspect-[12/7] overflow-hidden">
                  <Image
                    src={feature.Imge}
                    alt={altFromSrcOrAlt({
                      alt: feature.alt,
                      src: feature.Imge,
                      locale: country,
                    })}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 33vw"
                    className="object-contain object-top"
                  />
                </div>
                <div className="p-3 flex items-center justify-between gap-2">
                  <div className="ml-4">
                    <h4 className="text-[18px] font-semibold bg-gradient-to-r from-[#2CAA78] to-[#3B7FFF] bg-clip-text text-transparent">
                      {feature.label}
                    </h4>
                    <p className="text-white/70 text-[15px]">
                      {feature.description}
                    </p>
                  </div>
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-r from-[#2CAA78] to-[#3B7FFF]">
                    <img
                      src="/svgs/ARROW.svg"
                      alt="Arrow"
                      className="w-4 h-4"
                    />
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Magicalcore;
