import Image from "next/image";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { altFromSrcOrAlt } from "@/lib/altText";

const Home = ({ hero, country }) => {
  return (
    <section
      id="home"
      className="bg-[#12171B] text-white min-h-[90vh] flex flex-col justify-center items-center relative overflow-hidden"
    >
      <div className="mycontainer flex flex-col-reverse md:flex-row items-center justify-between">
        <div className="flex-1 flex flex-col gap-6 sm:gap-8 max-w-xl text-start md:text-left relative z-10 mt-5">
          <h1 className="text-[32px] sm:text-[40px] lg:text-[50px] font-bold leading-tight">
            {hero?.title} <br />
          </h1>

          <p className="text-[#FFFFFF] text-[18px] sm:text-[24px] leading-relaxed ">
            {hero?.description}
          </p>

          <div className="flex justify-start md:justify-start">
            <a
              href="/portal/login"
            >
              <button className="inline-flex cursor-pointer items-center justify-center gap-3 bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-medium px-5 sm:px-6 py-3 rounded-full  w-fit">
                <span className="text-[14px] sm:text-[16px]">
                  {hero?.buttonText}
                </span>
              </button>
            </a>
          </div>
        </div>

        <div className="flex-1 flex justify-center max-sm:min-h-[350px] md:justify-end relative z-10">
          <Image
            src={hero?.image}
            alt={altFromSrcOrAlt({
              alt: hero?.alt,
              src: hero?.image,
              locale: country,
            })}
            width={500}
            height={500}
            priority
            fetchPriority="high"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 500px"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-2xl h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
