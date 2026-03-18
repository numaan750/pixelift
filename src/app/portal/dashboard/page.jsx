"use client";

import Image from "next/image";
import React, { useContext, useState } from "react";
import Interior from "../components/pages/ImageUtilities";
import Exterior from "../components/pages/MagicRemove";
import Garden from "../components/pages/FunPresets";
import Explore from "../components/pages/Explore";
import ProfileDropdown from "@/components/ProfileDropdown";
import MyGallery from "../components/pages/MyGallery";
import PremiumPopup from "../components/pages/PremiumPopup";
import { Menu, X } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AppContext } from "@/context/Appcontext";
import { Toaster } from "react-hot-toast";
import Home from "../components/pages/Home";

const SoulmateSidebar = () => {
  const { isPremium, premiumExpiryDate } = useContext(AppContext);
  const [activeSection, setActiveSection] = useState("home");
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [isPremiumPopupOpen, setIsPremiumPopupOpen] = useState(false);
  const [soulmateStep, setSoulmateStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [showLeavePopup, setShowLeavePopup] = useState(false);
  const [pendingSection, setPendingSection] = useState(null);
  const [hasMessages, setHasMessages] = useState(false);
  const [exploreResetCount, setExploreResetCount] = useState(0);
  const [galleryResetCount, setGalleryResetCount] = useState(0);
  const [homeResetCount, setHomeResetCount] = useState(0);
  const [interiorResetCount, setInteriorResetCount] = useState(0);
  const [exteriorResetCount, setExteriorResetCount] = useState(0);
  const [gardenResetCount, setGardenResetCount] = useState(0);

  const chatSections = [
    "interior-design",
    "exterior-design",
    "garden-design",
    "Explore",
  ];

  const handleSectionChange = (section) => {
    if (chatSections.includes(activeSection) && hasMessages) {
      setPendingSection(section);
      setShowLeavePopup(true);
    } else {
      setActiveSection(section);
      setHasMessages(false);
    }
  };

  const handlePremiumSection = (section) => {
    if (
      isPremium &&
      premiumExpiryDate &&
      new Date() < new Date(premiumExpiryDate)
    ) {
      handleSectionChange(section);
    } else {
      setIsPremiumPopupOpen(true);
    }
  };

  return (
    <ProtectedRoute>
      <>
        <Toaster position="top-center" />
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden fixed z-50 p-3 bg-[#1D2933] w-full flex items-center gap-5"
          >
            <Menu size={24} className="text-[white]" />
            <span className="font-semibold text-[18px] bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] bg-clip-text text-transparent">
              PIXELIFT
            </span>
          </button>
        )}
        {open && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
        <div className="flex h-screen bg-[#1D2933] font-sans overflow-hidden">
          <aside
            className={`fixed top-0 left-0 z-40 lg:z-10 h-screen w-[80%] bg-[#12171B] text-white p-6 flex flex-col overflow-hidden transform transition-transform duration-300
           ${open ? "translate-x-0" : "-translate-x-full"}
           lg:translate-x-0 lg:static lg:w-64 lg:bg-transparent
          `}
          >
            {" "}
            <div className="flex items-center justify-between mb-4 border-b border-[#ABD8FC80] pb-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/pixellift.png"
                  alt="PIXELIFT"
                  width={40}
                  height={40}
                  className="rounded-xl"
                />
                <h3 className="font-bold bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] bg-clip-text text-transparent">
                  PIXELIFT
                </h3>
              </div>
              <button
                className="lg:hidden text-white"
                onClick={() => setOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
              <button
                onClick={() => {
                  handleSectionChange("home");
                  setActiveSubTab(null);
                  setHomeResetCount((prev) => prev + 1);
                  setOpen(false);
                }}
                className={`group w-full text-left px-4 py-3 rounded-full cursor-pointer flex items-center gap-3 ${
                  activeSection === "home"
                    ? "bg-[#12171B] text-white "
                    : "hover:bg-[#12171B] "
                }`}
              >
                <Image
                  src={
                    activeSection === "home"
                      ? "/svgs/home-active.svg"
                      : "/svgs/home.svg"
                  }
                  alt="Home icon"
                  width={20}
                  height={20}
                />
                <span
                  className={`font-medium text-[14px] ${activeSection === "home" ? "bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] bg-clip-text text-transparent" : ""}`}
                >
                  Home
                </span>
              </button>
              <button
                onClick={() => {
                  handleSectionChange("interior-design");
                  setActiveSubTab("interior-design");
                  setInteriorResetCount((prev) => prev + 1);
                  setOpen(false);
                }}
                // onClick={() => setIsPremiumPopupOpen(true)}
                // onClick={() => handlePremiumSection("any-dream")}
                className={`group w-full text-left px-4 py-3 rounded-full  cursor-pointer flex items-center gap-3 ${
                  activeSection === "interior-design"
                    ? "bg-[#12171B] text-white "
                    : "hover:bg-[#12171B]"
                }`}
              >
                <Image
                  src={
                    activeSection === "interior-design"
                      ? "/svgs/image-utiliz-active.svg"
                      : "/svgs/image-utiliz.svg"
                  }
                  alt="Image Utilities"
                  width={20}
                  height={20}
                />
                <span
                  className={`font-medium text-[14px] ${activeSection === "interior-design" ? "bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] bg-clip-text text-transparent" : ""}`}
                >
                  Image Utilities
                </span>
              </button>
              <button
                onClick={() => {
                  handleSectionChange("exterior-design");
                  setActiveSubTab("exterior-design");
                  setExteriorResetCount((prev) => prev + 1);
                  setOpen(false);
                }}
                className={`group w-full text-left px-4 py-3 rounded-full  cursor-pointer flex items-center gap-3 ${
                  activeSection === "exterior-design"
                    ? "bg-[#12171B] text-white "
                    : "hover:bg-[#12171B]"
                }`}
              >
                <Image
                  src={
                    activeSection === "exterior-design"
                      ? "/svgs/magic-remove-active.svg"
                      : "/svgs/magic-remov.svg"
                  }
                  alt="NIGHT-MARE"
                  width={20}
                  height={20}
                />
                <span
                  className={`font-medium text-[14px] ${activeSection === "exterior-design" ? "bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] bg-clip-text text-transparent" : ""}`}
                >
                  Magic Remove
                </span>{" "}
              </button>
              <button
                onClick={() => {
                  setActiveSection("garden-design");
                  setActiveSubTab("garden-design");
                  setGardenResetCount((prev) => prev + 1);
                  setOpen(false);
                }}
                // onClick={() => setIsPremiumPopupOpen(true)}
                // onClick={() => handlePremiumSection("day-dream")}
                className={`group w-full text-left px-4 py-3 rounded-full cursor-pointer flex items-center gap-3 ${
                  activeSection === "garden-design"
                    ? "bg-[#12171B] text-white"
                    : "hover:bg-[#12171B]"
                }`}
              >
                <Image
                  src={
                    activeSection === "garden-design"
                      ? "/svgs/fun-preset-active.svg"
                      : "/svgs/fun-preset.svg"
                  }
                  alt="Day-Dream"
                  width={20}
                  height={20}
                />
                <span
                  className={`font-medium text-[14px] ${activeSection === "garden-design" ? "bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] bg-clip-text text-transparent" : ""}`}
                >
                  Fun Presets
                </span>
              </button>
              <div className="border-b border-[#ABD8FC80] mt-5"></div>
              <button
                onClick={() => {
                  handleSectionChange("explore");
                  setActiveSubTab("explore");
                  setExploreResetCount((prev) => prev + 1);
                  setOpen(false);
                }}
                className={`group w-full text-left px-4 py-3 rounded-full  cursor-pointer flex items-center gap-3 mt-5 ${
                  activeSection === "explore"
                    ? "bg-[#12171B] text-white "
                    : "hover:bg-[#12171B]"
                }`}
              >
                <Image
                  src={
                    activeSection === "explore"
                      ? "/svgs/Explore-active.svg"
                      : "/svgs/Explore.svg"
                  }
                  alt="Home icon"
                  width={20}
                  height={20}
                />
                <span
                  className={`font-medium text-[14px] ${activeSection === "explore" ? "bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] bg-clip-text text-transparent" : ""}`}
                >
                  Explore
                </span>{" "}
              </button>
              <button
                onClick={() => {
                  handleSectionChange("my-gallery");
                  setActiveSubTab("my-gallery");
                  setGalleryResetCount((prev) => prev + 1);
                  setOpen(false);
                }}
                className={`group w-full text-left px-4 py-3 rounded-full  cursor-pointer flex items-center gap-3 ${
                  activeSection === "my-gallery"
                    ? "bg-[#12171B] text-white "
                    : "hover:bg-[#12171B]"
                }`}
              >
                <Image
                  src={
                    activeSection === "my-gallery"
                      ? "/svgs/History-active.svg"
                      : "/svgs/History.svg"
                  }
                  alt="History"
                  width={20}
                  height={20}
                />
                <span
                  className={`font-medium text-[14px] ${activeSection === "my-gallery" ? "bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] bg-clip-text text-transparent" : ""}`}
                >
                  History
                </span>
              </button>
            </nav>
            <div className="border-t border-[#ABD8FC80] pt-4 flex-shrink-0">
              {!isPremium && (
                <button
                  onClick={() => setIsPremiumPopupOpen(true)}
                  className="w-full text-left cursor-pointer px-4 py-3 rounded-full  flex items-center gap-3 hover:bg-[#12171B] group"
                >
                  <Image
                    src="/svgs/Primium-icon-active.svg"
                    alt="Home icon"
                    width={20}
                    height={20}
                    className="opacity-70 group-hover:brightness-0 group-hover:invert "
                  />
                  <span className="text-sm font-medium">Premium Plans</span>
                </button>
              )}
            </div>
          </aside>
          <div className="w-full lg:w-[80%] h-full flex overflow-hidden ">
            <main className="flex-1  bg-[#12171B] text-white flex flex-col lg:mt-10 pt-16 lg:pt-0 rounded-t-2xl rounded-b-r-2xl overflow-hidden border border-[#ABD8FC80]">
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="p-4 max-w-full flex-1 flex flex-col overflow-hidden">
                  <div className="sticky text-white top-0 z-10 bg-[#12171B] flex items-center justify-between mb-8 border-b pb-2 border-[#ABD8FC80] px-2 py-2">
                    <h3 className="text-[20px] font-bold tracking-tight flex">
                      {activeSection === "home" && "Home"}
                      {activeSection === "interior-design" && "Image Utilities"}
                      {activeSection === "exterior-design" && "Magic Remove"}
                      {activeSection === "garden-design" && "Fun Presets"}
                      {activeSection === "explore" && "Explore"}
                      {activeSection === "my-gallery" && "History"}
                      {activeSection === "premium-plans" && "Premium Plans"}
                    </h3>
                    <div className="flex items-center gap-3  cursor-pointer">
                      {!isPremium && (
                        <button
                          onClick={() => setIsPremiumPopupOpen(true)}
                          className="hidden sm:inline-flex items-center gap-2 cursor-pointer px-3 py-2 bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] rounded-full text-sm font-semibold text-white "
                        >
                          <Image
                            src="/svgs/Primium-icon-active.svg"
                            alt="Get Pro icon"
                            width={16}
                            height={16}
                          />
                          <span>Get Pro</span>
                        </button>
                      )}

                      <ProfileDropdown />
                    </div>
                  </div>
                  <div
                    className={`flex-1 flex flex-col ${
                      [
                        "Interior-Design",
                        "Exterior-Design",
                        "Garden-Design",
                        "Floor-ReStyle",
                        "Repaint",
                        "Explore",
                      ].includes(activeSection)
                        ? "overflow-hidden"
                        : "overflow-y-auto scrollbar-hide"
                    }`}
                  >
                    {" "}
                    {activeSection === "home" && (
                      <Home
                        key={homeResetCount}
                        handleSectionChange={handleSectionChange}
                        handlePremiumSection={handleSectionChange}
                        setActiveSection={setActiveSection}
                        setActiveSubTab={setActiveSubTab}
                      />
                    )}
                    {activeSection === "interior-design" && (
                      <Interior
                        key={interiorResetCount}
                        onMessageSent={() => setIsPremiumPopupOpen(true)}
                      />
                    )}
                    {activeSection === "exterior-design" && (
                      <Exterior
                        key={exteriorResetCount}
                        onMessageSent={() => setIsPremiumPopupOpen(true)}
                      />
                    )}
                    {activeSection === "garden-design" && (
                      <Garden
                        key={gardenResetCount}
                        onMessageSent={() => setIsPremiumPopupOpen(true)}
                      />
                    )}
                    {activeSection === "explore" && (
                      <Explore
                        onMessageSent={() => setHasMessages(true)}
                        resetExplore={exploreResetCount}
                      />
                    )}
                    {activeSection === "my-gallery" && (
                      <MyGallery key={galleryResetCount} />
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
          <PremiumPopup
            isOpen={isPremiumPopupOpen}
            onClose={() => setIsPremiumPopupOpen(false)}
          />
        </div>
      </>
    </ProtectedRoute>
  );
};

export default SoulmateSidebar;
