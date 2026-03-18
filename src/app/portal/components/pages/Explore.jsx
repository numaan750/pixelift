"use client";

import { useEffect, useState } from "react";
import { useRef } from "react";
import Image from "next/image";
import { IoShareSocialSharp } from "react-icons/io5";
import { GiSaveArrow } from "react-icons/gi";

const AI_TOOLS = [
  { id: "all", label: "All Categories" },
  { id: "Image Utilities", label: "Image Utilities" },
  { id: "Magic Remove", label: "Magic Remove" },
  { id: "Fun preset", label: "Fun preset" },
];
export const EXPLORE_IMAGES = [
  {
    id: 1,
    src: "/images/Exlore/fun-preset-1.png",
    alt: "Interior 1",
    category: "Fun preset",
  },
  {
    id: 3,
    src: "/images/Exlore/magic-remove-1.png",
    alt: "Magic Remove",
    category: "Magic Remove",
  },
  {
    id: 4,
    src: "/images/Exlore/fun-preset-2.png",
    alt: "Fun preset",
    category: "Fun preset",
  },
  {
    id: 5,
    src: "/images/Exlore/image-utilities-2.png",
    alt: "Image Utilities",
    category: "Image Utilities",
  },
  {
    id: 6,
    src: "/images/Exlore/image-utilities-3.png",
    alt: "Image Utilities",
    category: "Image Utilities",
  },
  {
    id: 7,
    src: "/images/Exlore/image-utilities-4.png",
    alt: "Image Utilities",
    category: "Image Utilities",
  },
  {
    id: 8,
    src: "/images/Exlore/image-utilities-5.png",
    alt: "Image Utilities",
    category: "Image Utilities",
  },
  {
    id: 9,
    src: "/images/Exlore/fun-preset-4.png",
    alt: "Fun preset",
    category: "Fun preset",
  },
  {
    id: 10,
    src: "/images/Exlore/image-utilities-6.png",
    alt: "Image Utilities",
    category: "Image Utilities",
  },
  {
    id: 11,
    src: "/images/Exlore/magic-remove-2.png",
    alt: "Magic Remove",
    category: "Magic Remove",
  },
  {
    id: 12,
    src: "/images/Exlore/fun-preset-5.png",
    alt: "Fun preset",
    category: "Fun preset",
  },
  {
    id: 13,
    src: "/images/Exlore/image-utilities-7.png",
    alt: "Image Utilities",
    category: "Image Utilities",
  },
  {
    id: 14,
    src: "/images/Exlore/fun-preset-6.png",
    alt: "Fun preset",
    category: "Fun preset",
  },
  {
    id: 15,
    src: "/images/Exlore/image-utilities-8.png",
    alt: "Image Utilities",
    category: "Image Utilities",
  },
  {
    id: 16,
    src: "/images/Exlore/magic-remove-3.png",
    alt: "Magic Remove",
    category: "Magic Remove",
  },
  {
    id: 17,
    src: "/images/Exlore/fun-preset-7.png",
    alt: "Fun preset",
    category: "Fun preset",
  },
  {
    id: 18,
    src: "/images/Exlore/image-utilities-9.png",
    alt: "Image Utilities",
    category: "Image Utilities",
  },
  {
    id: 19,
    src: "/images/Exlore/fun-preset-8.png",
    alt: "Fun preset",
    category: "Fun preset",
  },
  {
    id: 20,
    src: "/images/Exlore/image-utilities-10.png",
    alt: "Image Utilities",
    category: "Image Utilities",
  },
  {
    id: 21,
    src: "/images/Exlore/magic-remove-4.png",
    alt: "Magic Remove",
    category: "Magic Remove",
  },
  {
    id: 22,
    src: "/images/Exlore/image-utilities-11.png",
    alt: "Image Utilities",
    category: "Image Utilities",
  },
  {
    id: 23,
    src: "/images/Exlore/image-utilities-14.png",
    alt: "Image Utilities",
    category: "Image Utilities",
  },
  {
    id: 24,
    src: "/images/Exlore/image-utilities-12.png",
    alt: "Image Utilities",
    category: "Image Utilities",
  },
  {
    id: 25,
    src: "/images/Exlore/image-utilities-13.png",
    alt: "Image Utilities",
    category: "Image Utilities",
  },
];

export default function AiToolsExplore({ resetExplore }) {
  const [activeTool, setActiveTool] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setSelectedImage(null);
  }, [resetExplore]);

  const handleImageClick = (img) => {
    setSelectedImage(img);
    setShowResult(true);
  };

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
              className="flex-1 py-2.5 sm:py-2 rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-semibold text-[15px] sm:text-[18px] flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition"
            >
              <IoShareSocialSharp /> Share
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 sm:py-2 rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-semibold text-[15px] sm:text-[18px] flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition"
            >
              <GiSaveArrow /> Save
            </button>
          </div>
        </div>
      </div>
    );
  };

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

  const filteredImages =
    activeTool === "all"
      ? EXPLORE_IMAGES
      : EXPLORE_IMAGES.filter((img) => img.category === activeTool);
  return (
    <div className=" min-h-screen">
      <h2 className="text-[16px] font-semibold text-white mb-3">Categories</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide w-full">
        {AI_TOOLS.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex-shrink-0 px-8 py-2 cursor-pointer rounded-full text-[13px] font-semibold border transition-all duration-200 whitespace-nowrap
        ${
          isActive
            ? "bg-gradient-to-r from-[#3B7FFF]/50 to-[#2CAA78]/50 text-white border-teal-400"
            : "bg-gradient-to-r from-[#3B7FFF]/30 to-[#2CAA78]/30 text-gray-300 border-[#2e3d50] hover:border-teal-400 hover:text-white"
        }`}
            >
              {tool.label}
            </button>
          );
        })}
      </div>
      <h2 className="text-[16px] font-semibold text-white mt-6 mb-3">
        Inspiration
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
        {filteredImages.map((img) => {
          return (
            <div
              key={img.id}
              onClick={() => handleImageClick(img)}
              className="relative rounded-2xl overflow-hidden cursor-pointer
               aspect-square
               border-2 border-transparent hover:border-gray-300 transition-all duration-200"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
