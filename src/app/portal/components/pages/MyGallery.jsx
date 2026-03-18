"use client";

import Image from "next/image";
import { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "@/context/Appcontext";

// ─── Gallery Result Popup ─────────────────────────────────────────────────────
const GalleryResultPopup = ({ item, onClose }) => {
  const [showSplitter, setShowSplitter] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const handleMouseDown = () => {
    dragging.current = true;
  };
  const handleMouseUp = () => {
    dragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(
      Math.max(((e.clientX - rect.left) / rect.width) * 100, 0),
      100,
    );
    setSliderPos(pct);
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(
      Math.max(((e.touches[0].clientX - rect.left) / rect.width) * 100, 0),
      100,
    );
    setSliderPos(pct);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(item.imageUrl);
      const blob = await response.blob();
      if (window.showSaveFilePicker) {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: `pixelift-${item.toolId || "result"}.jpg`,
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
        link.download = `pixelift-${item.toolId || "result"}.jpg`;
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

  const afterImg = item.imageUrl;
  const beforeImg = item.uploadedImage || item.imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-[#12171B] rounded-xl w-full max-w-[400px] p-6 relative border border-[#ABD8FC80]">
        <button
          onClick={onClose}
          className="absolute top-2 right-1 w-4 h-4 rounded-full bg-[#F3F3F3] text-black flex items-center justify-center z-30 cursor-pointer text-sm font-bold"
        >
          ✕
        </button>
        <div
          ref={containerRef}
          className="relative mx-0 mt-0 rounded-xl overflow-hidden bg-white"
          style={{ height: "330px" }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {!showSplitter && (
            <img
              src={item.imageUrl}
              alt="generated result"
              className="w-full h-full object-contain"
            />
          )}

          {showSplitter && (
            <>
              <img
                src={afterImg}
                alt="after"
                className="absolute inset-0 w-full h-full object-contain"
                draggable={false}
              />
              <span className="absolute top-3 right-3 z-10 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full font-semibold select-none">
                AFTER
              </span>
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={beforeImg}
                  alt="before"
                  className="absolute inset-0 h-full object-contain"
                  style={{
                    width: `${containerRef.current?.offsetWidth || 300}px`,
                    maxWidth: "none",
                  }}
                  draggable={false}
                />
              </div>
              <span
                className="absolute top-3 z-10 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full font-semibold select-none"
                style={{ left: "12px" }}
              >
                BEFORE
              </span>
              <div
                className="absolute top-0 bottom-0 z-20 flex items-center"
                style={{
                  left: `${sliderPos}%`,
                  transform: "translateX(-50%)",
                  cursor: "col-resize",
                  userSelect: "none",
                }}
              >
                <div className="w-0.5 h-full bg-white absolute" />
                <div
                  className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center absolute z-10"
                  style={{
                    touchAction: "none",
                    cursor: "col-resize",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleMouseDown}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M5 4L2 8L5 12M11 4L14 8L11 12"
                      stroke="#555"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </>
          )}

          {item.uploadedImage && (
            <button
              onClick={() => setShowSplitter(!showSplitter)}
              className="absolute bottom-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center z-20 transition-all cursor-pointer"
              title="Before / After"
            >
              <Image
                src="/svgs/Compare-Icon.svg"
                alt="compare"
                width={20}
                height={20}
                className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px] object-contain"
              />
            </button>
          )}
        </div>
        {item.toolId && (
          <div className="flex mt-3">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r from-[#3B7FFF]/20 to-[#2CAA78]/20 border border-[#3B7FFF]/30 text-white/70 capitalize">
              {item.toolId.replace(/-/g, " ")}
            </span>
          </div>
        )}

        <div className="flex gap-3 mt-3">
          <button
            onClick={async () => {
              try {
                const imageUrl = item.imageUrl;
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
              className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px] object-contain"
            />{" "}
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
              className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px] object-contain"
            />{" "}
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Gallery Component ───────────────────────────────────────────────────
const MyGallery = () => {
  const { gallery, fetchGallery } = useContext(AppContext);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  return (
    <div className="text-white">
      <div className="flex gap-3 mb-6">
        <p className="text-[16px] font-semibold">Recent Activity</p>
      </div>

      {gallery.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="w-14 h-14 flex items-center justify-center">
            <Image
              src="/svgs/empty-History.svg"
              alt="empty-gallery"
              width={100}
              height={100}
            />
          </div>
          <p className="text-[15px] font-medium text-white">Nothing Here Yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {gallery.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedItem(item)}
              className="rounded-2xl overflow-hidden cursor-pointer"
            >
              <div className="aspect-square rounded-xl overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={`gallery-${index}`}
                  width={300}
                  height={300}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedItem && (
        <GalleryResultPopup
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default MyGallery;
