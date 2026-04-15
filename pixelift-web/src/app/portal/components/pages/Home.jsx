"use client";

import Image from "next/image";
import { useState } from "react";
import { EXPLORE_IMAGES } from "./Explore";
import { IoShareSocialSharp } from "react-icons/io5";
import { GiSaveArrow } from "react-icons/gi";

const ResultScreen = ({ imageSrc, onClose }) => {
  const handleSave = async () => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      if (window.showSaveFilePicker) {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: `pixelift-result.jpg`,
          types: [
            {
              description: "Image",
              accept: { "image/jpeg": [".jpg", ".jpeg"] },
            },
          ],
        });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      } else {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `pixelift-result.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        alert("Download failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="text-white cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 19l-7-7 7-7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h4 className="text-[16px] font-semibold text-white">Result</h4>
        </div>
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-[#3B7FFF]/20 to-[#2CAA78]/20 border border-[#ABD8FC80] h-[280px] sm:h-[320px] md:h-[360px]">
          <img
            src={imageSrc}
            alt="explore result"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="flex-shrink-0 bg-[#12171B] flex flex-col items-center gap-3 pt-4 pb-2 px-2">
        <div className="flex w-full sm:w-[400px] gap-3">
          <button
            onClick={async () => {
              try {
                const imageUrl = imageSrc;
                if (navigator.share) {
                  const response = await fetch(imageUrl);
                  const blob = await response.blob();
                  const file = new File([blob], "pixelift-result.jpg", {
                    type: blob.type,
                  });
                  if (
                    navigator.canShare &&
                    navigator.canShare({ files: [file] })
                  ) {
                    await navigator.share({
                      title: "Check out my edited photo!",
                      text: "Created with Pixelift AI",
                      files: [file],
                    });
                  } else {
                    await navigator.share({
                      title: "Check out my edited photo!",
                      text: "Created with Pixelift AI",
                      url: imageUrl,
                    });
                  }
                } else {
                  await navigator.clipboard.writeText(imageUrl);
                  alert("Link copied to clipboard!");
                }
              } catch (err) {
                if (err.name !== "AbortError") {
                  alert("Share failed. Please try again.");
                }
              }
            }}
            className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-semibold text-[15px] sm:text-[18px] flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition"
          >
            <IoShareSocialSharp /> Share
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-semibold text-[15px] sm:text-[18px] flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition"
          >
            <GiSaveArrow /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

const Home = ({
  handleSectionChange,
  handlePremiumSection,
  setActiveSection,
  setActiveSubTab,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const firstEightImages = EXPLORE_IMAGES.slice(0, 8);
  const features = [
    {
      label: "Image Utilities",
      image: "/images/IMAGE-UTILITIES.png",
      onClick: (fns) => fns.handlePremiumSection("interior-design"),
      isPremium: true,
      description: "Creative hub for smart, stunning images",
    },
    {
      label: "Magic Remover",
      image: "/images/MAGIC-REMOVER.png",
      onClick: (fns) => fns.handleSectionChange("exterior-design"),
      isPremium: false,
      description: "Remove distractions with a single touch",
    },
    {
      label: "Fun Presets",
      image: "/images/FUN-PRESET.png",
      onClick: (fns) => fns.handlePremiumSection("garden-design"),
      isPremium: true,
      description: "Instantly restyle your photos with flair",
    },
  ];

  if (showResult && selectedImage) {
    return (
      <ResultScreen
        imageSrc={selectedImage.src}
        onClose={() => {
          setShowResult(false);
          setSelectedImage(null);
        }}
      />
    );
  }
  return (
    <div className="space-y-2">
      <div className="text-center">
        <h4 className="text-[18px] sm:text-[32px] font-semibold bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-transparent bg-clip-text">
          Lets Enhance Your Photo
        </h4>

        <p className="text-[14px] sm:text-[18px] text-white mt-2">
          Create your photo enhanced and of high quality
        </p>
      </div>

      <h4 className="text-[12px] sm:text-[16px] font-semibold text-white mt-6">
        Select a Option
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {features.map((feature, index) => (
          <div
            key={index}
            onClick={() =>
              feature.onClick({ handleSectionChange, handlePremiumSection })
            }
            className="relative bg-[#1D2933] rounded-[50px] overflow-hidden cursor-pointer"
          >
            <div className="relative w-full aspect-[12/7] overflow-hidden">
              <Image
                src={feature.image}
                alt={feature.label}
                fill
                className="object-contain object-top"
              />
            </div>
            <div className="p-3 sm:p-3 flex items-center justify-between gap-2 ">
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
                  className="w-4 h-4 sm:w-4 sm:h-4 md:w-3 md:h-3"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-[16px] font-semibold">Explore Ideas</h4>

          <button
            onClick={() => handleSectionChange("explore")}
            className="text-sm font-medium cursor-pointer bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-transparent bg-clip-text hover:underline"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {firstEightImages.map((img) => (
            <div
              key={img.id}
              onClick={() => {
                setSelectedImage(img);
                setShowResult(true);
              }}
              className="relative rounded-2xl overflow-hidden cursor-pointer aspect-square border-2 border-transparent hover:border-gray-300 transition"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

