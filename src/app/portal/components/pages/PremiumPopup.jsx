"use client";

import { AppContext } from "@/context/Appcontext";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

const PremiumPopup = ({ isOpen, onClose }) => {
  const [plan, setPlan] = useState("yearly");
  const { activatePremium } = useContext(AppContext);
  const [activating, setActivating] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative border-2 border-[#12171B] flex flex-col lg:flex-row w-full max-w-5xl h-[450px] sm:h-auto lg:h-[600px] bg-[#12171B] text-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 lg:top-6 lg:right-6 z-10 w-5 h-5 lg:w-10 lg:h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white hover:bg-gray-200 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-3 h-3 lg:w-5 lg:h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="relative lg:w-1/2 overflow-hidden">
          <div className="hidden lg:block relative w-full h-full">
            <Image
              src="/images/pixelift-Primium.png"
              alt="Home-Aura"
              fill
              className="object-containe"
              priority
            />
          </div>
        </div>
        <button className="absolute top-6 left-6 lg:block hidden bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#98ADEE] transition z-10">
          Restore
        </button>

        <button className="lg:hidden absolute top-4 left-4 bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white px-2 py-1 rounded-full text-[10px] font-semibold hover:bg-[#98ADEE] transition z-10">
          Restore
        </button>

        <div className="w-full lg:w-1/2 mt-4 flex flex-col justify-center items-center px-4 py-4 sm:px-6 sm:py-6">
          <div className="w-full">
            <div className="max-w-md mx-auto w-full">
              <div className="text-center">
                <div className="flex flex-row sm:flex-row justify-center items-center gap-2 mb-4 mt-2">
                  <h3 className="text-[14px] sm:text-[16px] font-semibold bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78]   bg-clip-text text-transparent">
                    PIXELIFT
                  </h3>
                  <span className="inline-flex items-center gap-2 cursor-pointer px-2 py-1 bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] rounded-full text-[10px] font-semibold text-white shadow-lg hover:bg-[#98ADEE] transition">
                    <Image
                      src="/svgs/Primium-icon-active.svg"
                      alt="get-pro"
                      width={12}
                      height={12}
                      className="rounded-full"
                    />
                    <span>Get Pro</span>
                  </span>
                </div>

                <p className="font-bold text-[16px] sm:text-[20px] mb-4">
                  Unleash Your Creativity With Pro
                </p>
              </div>

              <div className="mb-5 flex flex-col items-center">
                <div className="hidden sm:flex sm:flex-col space-y-2 text-[12px] text-white items-center">
                  {[
                    "Premium Styles",
                    "Remove Ads",
                    "No Watermark",
                    "And Much More",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 w-full max-w-[200px]"
                    >
                      <span className="w-4 h-4 flex items-center  justify-center rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-black text-[10px] font-bold shrink-0">
                        ✓
                      </span>
                      <span className="text-left">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="sm:hidden grid grid-cols-2 gap-x-2 gap-y-2 text-[12px] text-white max-w-[200px] mx-auto gap-8">
                  {[
                    "Premium Styles",
                    "Remove Ads",
                    "No Watermark",
                    "And Much More",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-4 h-4 flex items-center justify-center rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-black text-[10px] font-bold shrink-0">
                        ✓
                      </span>
                      <span className="text-left text-[10px] whitespace-nowrap">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                onClick={() => setPlan("yearly")}
                className={`cursor-pointer rounded-full sm:rounded-full px-3 sm:px-4 py-2 sm:py-3 border border-[#3B7FFF] transition relative mb-4
                ${
                  plan === "yearly"
                    ? " bg-gradient-to-r from-[#3B7FFF]/40 to-[#2CAA78]/40"
                    : "border-[#3B7FFF]/90"
                }
              `}
              >
                <div className="absolute -top-4 right-4 bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white text-[10px] px-1 py-0.5 rounded-full">
                  Best Offer
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border border-[#3B7FFF] font-bold shrink-0
                      ${
                        plan === "yearly"
                          ? " bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white"
                          : "border-[#3B7FFF]/90"
                      }
                    `}
                    >
                      {plan === "yearly" && "✓"}
                    </div>

                    <div>
                      <p className="font-semibold text-[12px] sm:text-[16px]">
                        Yearly Plan
                      </p>
                      <p className="text-[12px] text-[#F3F3F3]">
                        Just Rs. 164.58 Per Week
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-[12px] sm:text-[16px]">
                      Rs.7900
                    </p>
                    <p className="text-[12px] text-[#F3F3F3]">Per Year</p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setPlan("weekly")}
                className={`cursor-pointer rounded-full sm:rounded-full px-3 sm:px-4 py-2 sm:py-3 border border-[#3B7FFF] transition relative mb-4
                ${
                  plan === "weekly"
                    ? " bg-gradient-to-r from-[#3B7FFF]/40 to-[#2CAA78]/40"
                    : "border-[#3B7FFF]/90"
                }
              `}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border border-[#3B7FFF] flex items-center justify-center font-bold shrink-0
                      ${
                        plan === "weekly"
                          ? " bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white"
                          : "border-[#3B7FFF]/90"
                      }
                    `}
                    >
                      {plan === "weekly" && "✓"}
                    </div>

                    <p className="font-semibold text-[12px] sm:text-[16px]">
                      Weekly Plan
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-[12px] sm:text-[16px]">
                      Rs.1500
                    </p>
                    <p className="text-[12px] text-[#F3F3F3]">Per Week</p>
                  </div>
                </div>
              </div>

              <p className="text-[10px] sm:text-[14px] text-[#F3F3F3CC] text-center mb-4">
                Auto Renewable, Cancel Anytime
              </p>

              <button
                // onClick={async () => {
                //   try {
                //     setActivating(true);
                //     await activatePremium(plan);
                //     setActivating(false);
                //     onClose();
                //     toast.success("Premium activated! Enjoy all features.");
                //   } catch (err) {
                //     setActivating(false);
                //     toast.error(
                //       "Failed to activate premium. Please try again.",
                //     );
                //   }
                // }}
                onClick={() => setActivating(true)}
                disabled={activating}
                className="w-full mb-4 bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] cursor-pointer text-white px-4 py-3 sm:py-4 rounded-full font-semibold hover:bg-[#98ADEE] transition text-sm sm:text-base disabled:opacity-70 flex items-center justify-center relative"
              >
                {activating ? (
                  // <span>Activating...</span>
                  <svg
                    className="animate-spin h-6 w-6 text-white"
                    viewBox="0 0 50 50"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    >
                      <line x1="25" y1="5" x2="25" y2="12" opacity="1" />
                      <line
                        x1="25"
                        y1="5"
                        x2="25"
                        y2="12"
                        transform="rotate(30 25 25)"
                        opacity="0.9"
                      />
                      <line
                        x1="25"
                        y1="5"
                        x2="25"
                        y2="12"
                        transform="rotate(60 25 25)"
                        opacity="0.8"
                      />
                      <line
                        x1="25"
                        y1="5"
                        x2="25"
                        y2="12"
                        transform="rotate(90 25 25)"
                        opacity="0.7"
                      />
                      <line
                        x1="25"
                        y1="5"
                        x2="25"
                        y2="12"
                        transform="rotate(120 25 25)"
                        opacity="0.6"
                      />
                      <line
                        x1="25"
                        y1="5"
                        x2="25"
                        y2="12"
                        transform="rotate(150 25 25)"
                        opacity="0.5"
                      />
                      <line
                        x1="25"
                        y1="5"
                        x2="25"
                        y2="12"
                        transform="rotate(180 25 25)"
                        opacity="0.4"
                      />
                      <line
                        x1="25"
                        y1="5"
                        x2="25"
                        y2="12"
                        transform="rotate(210 25 25)"
                        opacity="0.3"
                      />
                      <line
                        x1="25"
                        y1="5"
                        x2="25"
                        y2="12"
                        transform="rotate(240 25 25)"
                        opacity="0.25"
                      />
                      <line
                        x1="25"
                        y1="5"
                        x2="25"
                        y2="12"
                        transform="rotate(270 25 25)"
                        opacity="0.2"
                      />
                      <line
                        x1="25"
                        y1="5"
                        x2="25"
                        y2="12"
                        transform="rotate(300 25 25)"
                        opacity="0.15"
                      />
                      <line
                        x1="25"
                        y1="5"
                        x2="25"
                        y2="12"
                        transform="rotate(330 25 25)"
                        opacity="0.1"
                      />
                    </g>
                  </svg>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>Continue</span>
                    <Image
                      src="/svgs/Home-Aura-Continu-Errow-Icon.svg"
                      alt="Arrow icon"
                      width={14}
                      height={14}
                      className="mt-1"
                    />
                  </span>
                )}
              </button>

              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-[10px] sm:text-[14px] text-[#F3F3F3CC]">
                <Link
                  href={"https://www.aisoulmatedrawings.com/conditions"}
                  target="_blank"
                  className=" hover:bg-gradient-to-r hover:from-[#3B7FFF] hover:to-[#2CAA78] hover:bg-clip-text hover:text-transparent cursor-pointer transition"
                >
                  Term of Use
                </Link>
                <button
                  onClick={onClose}
                  className="hover:bg-gradient-to-r hover:from-[#3B7FFF] hover:to-[#2CAA78] hover:bg-clip-text hover:text-transparent cursor-pointer transition"
                >
                  Continue With Free Plan
                </button>
                <Link
                  href="https://www.aisoulmatedrawings.com/privecypolice"
                  target="_blank"
                  className=" hover:bg-gradient-to-r hover:from-[#3B7FFF] hover:to-[#2CAA78] hover:bg-clip-text hover:text-transparent cursor-pointer transition"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PremiumPopup;
