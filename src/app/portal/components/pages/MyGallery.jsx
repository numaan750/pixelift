"use client";

import Image from "next/image";
import { useState, useEffect, useContext, useRef } from "react";
import { RiEdit2Fill } from "react-icons/ri";
import { IoShareSocialSharp } from "react-icons/io5";
import { GiSaveArrow } from "react-icons/gi";
import HomeAuraLoadingScreen from "../PixeliftLoadingScreen";
import { AppContext } from "@/context/Appcontext";

// ─── Gallery Edit Screen ──────────────────────────────────────────────────────
const GalleryEditScreen = ({ item, onBack, onEditDone, onMessageSent }) => {
  const { credits, setCredits, user, setUser } = useContext(AppContext);
  const [editPrompt, setEditPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEditGenerate = async () => {
    if (!editPrompt.trim()) return;
    if (credits !== Infinity && credits <= 0) {
      onMessageSent?.();
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            toolId: item.toolId,
            section: "image-utilities",
            uploadedImage: item.imageUrl,
            toolOptions: { editPrompt },
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        if (data.needsPremium) {
          onMessageSent?.();
          return;
        }
        throw new Error(data.message || "Edit failed");
      }
      if (data.creditsLeft !== undefined) {
        const newCredits =
          data.creditsLeft === "unlimited" ? Infinity : data.creditsLeft;
        setCredits(newCredits);
        if (user) {
          const updatedUser = { ...user, credits: newCredits };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }
      onEditDone({
        ...item,
        imageUrl: data.imageUrl,
        uploadedImage: item.imageUrl,
      });
    } catch (error) {
      console.error("Edit error:", error);
      alert("Edit failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {loading && <HomeAuraLoadingScreen />}
      <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-4 pb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-white cursor-pointer">
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
          <h4 className="text-[16px] font-semibold text-white">Edit Photo</h4>
        </div>
        <div
          className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#3B7FFF]/20 to-[#2CAA78]/20 border border-[#ABD8FC80]"
          style={{ height: "260px" }}
        >
          <img
            src={item.imageUrl}
            alt="edit-preview"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white text-[14px] font-medium">
            Describe your changes
          </label>
          <textarea
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            placeholder="e.g. Make the background white, add more brightness..."
            className="w-full bg-gradient-to-b from-[#3B7FFF]/20 to-[#2CAA78]/20 border border-[#ABD8FC80] text-white text-[14px] rounded-2xl p-4 focus:border-[#3B7FFF] outline-none resize-none placeholder:text-white/40"
            rows={3}
          />
        </div>
      </div>
      <div className="flex-shrink-0 bg-[#12171B] flex justify-center pt-4 pb-2">
        <button
          onClick={handleEditGenerate}
          disabled={!editPrompt.trim() || loading}
          className={`w-full max-w-[500px] py-3 rounded-full font-semibold text-[18px] text-[#F3F3F3] transition flex items-center justify-center gap-2
            ${
              editPrompt.trim() && !loading
                ? "bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] cursor-pointer hover:opacity-90"
                : "bg-gray-600 cursor-not-allowed opacity-50"
            }`}
        >
          {loading ? "Processing..." : "Generate Edit"}
        </button>
      </div>
    </div>
  );
};

// ─── Gallery Result Screen ─────────────────────────────────────────────────────
const GalleryResultScreen = ({ item, onClose, onEdit }) => {
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
      if (err.name !== "AbortError")
        alert("Download failed. Please try again.");
    }
  };

  const handleShare = async () => {
    try {
      const imageUrl = item.imageUrl;
      if (navigator.share) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "pixelift-result.jpg", {
          type: blob.type,
        });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
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
      if (err.name !== "AbortError") alert("Share failed. Please try again.");
    }
  };

  const afterImg = item.imageUrl;
  const beforeImg = item.uploadedImage || item.imageUrl;

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
        <div
          ref={containerRef}
          className="relative rounded-xl overflow-hidden bg-gradient-to-b from-[#3B7FFF]/20 to-[#2CAA78]/20 border border-[#ABD8FC80] h-[280px] sm:h-[320px] md:h-[360px]"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {!showSplitter && (
            <img
              src={item.imageUrl}
              alt="result"
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
          <div className="flex">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r from-[#3B7FFF]/20 to-[#2CAA78]/20 border border-[#3B7FFF]/30 text-white/70 capitalize">
              {item.toolId.replace(/-/g, " ")}
            </span>
          </div>
        )}
      </div>
      <div className="flex-shrink-0 bg-[#12171B] flex flex-col items-center gap-3 pt-4 pb-2 px-2">
        <div className="flex gap-3 w-full sm:w-[400px]">
          <button
            onClick={handleShare}
            className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-semibold text-[15px] sm:text-[18px] flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition"
          >
            <IoShareSocialSharp /> Share
          </button>
          <button
            onClick={onEdit}
            className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-semibold text-[15px] sm:text-[18px] flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition"
          >
            <RiEdit2Fill /> Edit
          </button>
        </div>
        <div className="flex w-full sm:w-[400px]">
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

// ─── Main Gallery Component ───────────────────────────────────────────────────
const MyGallery = ({ onMessageSent }) => {
  const { gallery, fetchGallery } = useContext(AppContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);
  if (showEdit && currentItem) {
    return (
      <GalleryEditScreen
        item={currentItem}
        onBack={() => setShowEdit(false)}
        onEditDone={(updatedItem) => {
          setCurrentItem(updatedItem);
          setShowEdit(false);
        }}
        onMessageSent={onMessageSent}
      />
    );
  }
  if (selectedItem) {
    return (
      <GalleryResultScreen
        item={currentItem || selectedItem}
        onClose={() => {
          setSelectedItem(null);
          setCurrentItem(null);
        }}
        onEdit={() => {
          setCurrentItem(currentItem || selectedItem);
          setShowEdit(true);
        }}
      />
    );
  }
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
              onClick={() => {
                setSelectedItem(item);
                setCurrentItem(item);
              }}
              className="rounded-2xl overflow-hidden cursor-pointer"
            >
              <div className="aspect-square rounded-xl overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={`gallery-${index}`}
                  width={300}
                  height={300}
                  unoptimized
                  priority={index < 6}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGallery;
