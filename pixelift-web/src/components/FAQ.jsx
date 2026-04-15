"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { altFromSrcOrAlt } from "@/lib/altText";

const FAQ = ({ faqs, country }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqItems = Array.isArray(faqs) ? faqs : faqs?.faq || [];
  const title = Array.isArray(faqs) ? "FAQs" : faqs?.title;
  const imgSrc = Array.isArray(faqs)
    ? "/home-images/FAQ-Img.webp"
    : faqs?.img || "/home-images/FAQ-Img.webp";
  const imgAlt = altFromSrcOrAlt({
    alt: Array.isArray(faqs) ? "FAQ" : faqs?.alt,
    src: imgSrc,
    locale: country,
  });

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className=" bg-[#12171B] text-white ">
      <div className="mycontainer  py-15">
        <h2 className="text-[24px] sm:text-[30px] md:text-[40px] font-bold mb-12 text-center">
          {title}
        </h2>
        <p className="-mt-8 mb-10 text-center text-gray-400 text-[14px] sm:text-[16px]">
          Looking for more tips? Visit our{" "}
          <Link
            href="/blog"
            className="underline text-white hover:text-gray-200"
          >
            blog
          </Link>{" "}
          or start with{" "}
          <Link
            href="/blog/ai-soulmate-drawing-generator"
            className="underline text-white hover:text-gray-200"
          >
            this guide
          </Link>
          . For help, you can also{" "}
          <Link
            href="/contact"
            className="underline text-white hover:text-gray-200"
          >
            contact us
          </Link>
          .
        </p>
        <div className="grid md:grid-cols-2 gap-15 items-center">
          <div className="order-2 md:order-1">
            <div className="space-y-4 ">
              {faqItems.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-[#3B7FFF]/10 to-[#2CAA78]/10 rounded-[30px] overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                  >
                    <span className="font-medium text-[16px] sm:text-[22px] pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      openIndex === index
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <div className="px-6 pb-5 text-white text-[16px] sm:text-[16px]">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <div className="relative w-full max-w-xl">
              <div className="">
                <Image
                  src={imgSrc}
                  alt={imgAlt}
                  width={800}
                  height={600}
                  className="w-full max-w-xl object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

