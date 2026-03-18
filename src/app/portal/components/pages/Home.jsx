"use client";

import Image from "next/image";
import { useState } from "react";
import { EXPLORE_IMAGES } from "./Explore";

const ResultPopup = ({ imageSrc, onClose }) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-[#12171B] rounded-xl w-full max-w-[400px] p-3 relative border border-[#ABD8FC80]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#F3F3F3] text-black flex items-center justify-center z-30 cursor-pointer text-sm font-bold"
        >
          ✕
        </button>
        <div
          className="relative mx-5 mt-3 rounded-xl overflow-hidden bg-white"
          style={{ height: "330px" }}
        >
          <img
            src={imageSrc}
            alt="explore result"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex gap-3 p-5 mt-2">
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
            className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-semibold text-[15px] flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition"
          >
            <Image
              src="/svgs/share.svg"
              alt="share"
              width={20}
              height={20}
              className="w-[18px] h-[18px] object-contain"
            />
            SHARE
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-semibold text-[15px] flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition"
          >
            <Image
              src="/svgs/Save.svg"
              alt="save"
              width={20}
              height={20}
              className="w-[18px] h-[18px] object-contain"
            />
            SAVE
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

      <h4 className="text-[12px] sm:text-[16px] font-semibold text-white mt-6 mb-3">
        Select a Option
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {features.map((feature, index) => (
          <div
            key={index}
            onClick={() =>
              feature.onClick({ handleSectionChange, handlePremiumSection })
            }
            className="relative bg-[#1D2933] rounded-4xl overflow-hidden cursor-pointer"
          >
            <div className="relative w-full h-48 sm:h-56">
              <Image src={feature.image} alt={feature.label} fill />
            </div>
            <div className="p-2 flex items-center justify-between">
              <div className="ml-4">
                <h4 className="text-[18px] font-semibold mb-1 bg-gradient-to-r from-[#2CAA78] to-[#3B7FFF] bg-clip-text text-transparent">
                  {feature.label}
                </h4>
                <p className="text-white/70 text-[15px]">
                  {feature.description}
                </p>
              </div>
              <div className="w-14 h-14 sm:w-14 sm:h-14 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-r from-[#2CAA78] to-[#3B7FFF]">
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
              onClick={() => setSelectedImage(img)}
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
      {selectedImage && (
        <ResultPopup
          imageSrc={selectedImage.src}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default Home;
