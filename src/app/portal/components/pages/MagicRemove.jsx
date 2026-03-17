"use client";
import Image from "next/image";
import { useState, useRef } from "react";
import HomeAuraLoadingScreen from "../PixeliftLoadingScreen";

const tools = [
  {
    id: "background-remover",
    label: "Background Remover",
    description: "Remove backgrounds or swap them with new styles in seconds.",
    uploadHint: "Upload your photo for instant Background Remove",
    buttonLabel: "Background Remover",
    bg: "#1D2933",
    icon: "/svgs/tools/ai-photo-enhancer.svg",
    previewImage: "/images/remove-object/BACKGROUND-REMOVER.png",
    showColors: true,
  },
  {
    id: "remove-object",
    label: "Remove Object",
    description:
      "Remove distracting elements from your photos quickly and smoothly.",
    uploadHint: "Upload your photo to move the remove object",
    buttonLabel: "Remove Object",
    bg: "#1D2933",
    icon: "/svgs/tools/move-camera.svg",
    previewImage: "/images/remove-object/REMOVE-OBJECT.png",
  },
  {
    id: "remove-text",
    label: "Remove Text",
    description: "Easily remove unwanted text effortlessly",
    uploadHint: "Upload your photo to remove text",
    buttonLabel: "Remove Text",
    bg: "#1D2933",
    icon: "/svgs/tools/relight.svg",
    previewImage: "/images/remove-object/REMOVE-TEXT.png",
  },
];

const colors = [
  {
    label: "Transparent BG",
    swatches: [],
    isTransparent: true,
  },
  {
    label: "Surprise Me",
    swatches: ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF"],
    isSurprise: true,
  },
  {
    label: "Pick Color",
    swatches: ["#FF00FF", "#FFFF00", "#00FFFF", "#FF0000"],
    isPicker: true,
  },

  {
    label: "Soft White",
    swatches: ["#F8F8F4"],
  },
  {
    label: "Sage Green",
    swatches: ["#A8BBA2"],
  },
  {
    label: "Terracotta",
    swatches: ["#D88C70"],
  },
  {
    label: "Lavender",
    swatches: ["#C1B2D4"],
  },
  {
    label: "Sunset Coral",
    swatches: ["#F28B81"],
  },
  {
    label: "Blush Pink",
    swatches: ["#F4C6C6"],
  },
  {
    label: "Peach Fuzz",
    swatches: ["#FAD7AF"],
  },
  {
    label: "Pale Aqua",
    swatches: ["#BCE3D4"],
  },
  {
    label: "Charcoal Black",
    swatches: ["#1C1C1C"],
  },
  {
    label: "Navy Blue",
    swatches: ["#2C3E50"],
  },
  {
    label: "Mustard Yellow",
    swatches: ["#D9A441"],
  },
  {
    label: "Sky Blue",
    swatches: ["#B3D7E4"],
  },
  { label: "Emerald Green", swatches: ["#3E826C"] },
];

const ViewAllPopup = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="bg-[#12171B] rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
      <div className="flex items-center justify-between p-5 border-b border-[#ABD8FC80]">
        <h3 className="text-[18px] font-bold text-">{title}</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition cursor-pointer text-black font-bold"
        >
          ✕
        </button>
      </div>
      <div className="overflow-y-auto p-5 scrollbar-hide">{children}</div>
    </div>
  </div>
);

// ─── Result Popup ─────────────────────────────────────────────────────────────
const ResultPopup = ({ tool, uploadedImage, beforeImage, onClose }) => {
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
      const response = await fetch(uploadedImage);
      const blob = await response.blob();
      if (window.showSaveFilePicker) {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: `pixelift-${tool.id || "result"}.jpg`,
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
        link.download = `pixelift-${tool.id || "result"}.jpg`;
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
  const afterImg = uploadedImage;
  const beforeImg = beforeImage || uploadedImage;

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
          ref={containerRef}
          className="relative mx-5 mt-3 rounded-xl overflow-hidden bg-white"
          style={{ height: "330px" }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {!showSplitter &&
            (uploadedImage ? (
              <img
                src={uploadedImage}
                alt="result"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                {tool.label} Result
              </div>
            ))}
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
        </div>
        <div className="flex gap-3 p-5 mt-2">
          <button
            onClick={async () => {
              try {
                const imageUrl = uploadedImage;
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
              alt="share"
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

// ─── Upload Screen (Screen 2) ─────────────────────────────────────────────────
const UploadScreen = ({ tool, onBack, onMessageSent }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState("Soft White");
  const [selectedColorHex, setSelectedColorHex] = useState("#F8F8F4");
  const [prompt, setPrompt] = useState("");
  const [pickedColor, setPickedColor] = useState("#FF00FF");
  const [popup, setPopup] = useState(null);
  const [beforeImage, setBeforeImage] = useState(null);
  const colorScrollRef = useRef(null);
  const colorInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFile(file);
    setUploadedImage(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setUploadedFile(file);
    setUploadedImage(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setUploadedFile(null);
  };

  const handleGenerate = async () => {
    if (!uploadedFile) return;
    if (tool.id === "remove-object" && !prompt.trim()) return;
    setLoading(true);

    try {
      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
        });

      const base64Image = await toBase64(uploadedFile);
      setBeforeImage(base64Image);

      let toolOptions = {};

      if (tool.id === "background-remover") {
        if (selectedColor === "Transparent BG") {
          toolOptions = { backgroundColor: "transparent" };
        } else if (selectedColor === "Surprise Me") {
          toolOptions = { backgroundColor: "surprise" };
        } else if (selectedColor === "Pick Color") {
          toolOptions = { backgroundColor: pickedColor };
        } else {
          toolOptions = { backgroundColor: selectedColorHex };
        }
      }

      if (tool.id === "remove-object") {
        toolOptions = { prompt: prompt };
      }

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
            toolId: tool.id,
            section: "magic-remove",
            uploadedImage: base64Image,
            toolOptions,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.needsPremium) {
          onMessageSent && onMessageSent();
          return;
        }
        throw new Error(data.message || "Generation failed");
      }

      setUploadedImage(data.imageUrl);
      setShowResult(true);
    } catch (error) {
      console.error("Generation error:", error);
      alert("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToSelected = (ref, label, list) => {
    const index = list.findIndex((c) => c.label === label);
    if (ref.current && index !== -1) {
      ref.current.children[index]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }
  };

  const canGenerate =
    !!uploadedFile &&
    !loading &&
    (tool.id !== "remove-object" || prompt.trim().length > 0);
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide gap-4 p-2 pb-4 flex flex-col">
      {loading && <HomeAuraLoadingScreen />}
      <div className="flex-1 overflow-y-auto scrollbar-hide gap-4 p-2 pb-4 flex flex-col">
        <h4 className="text-[16px] font-semibold text-white">Add A Photo</h4>
        <div
          onClick={() => !uploadedImage && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex-shrink-0 flex flex-col items-center justify-center 
           bg-gradient-to-b from-[#3B7FFF]/20 to-[#2CAA78]/20 
           border-2 rounded-3xl p-6 transition-all
           h-[280px] sm:h-[320px] md:h-[360px]
            ${isDragging ? "border-[#3B7FFF] scale-[1.01]" : "border-[#3B7FFF]/20"}
           ${!uploadedImage ? "cursor-pointer" : ""}`}
        >
          {uploadedImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={uploadedImage}
                alt="uploaded"
                className="w-full h-full rounded-xl object-contain"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-black/70 text-white text-sm flex items-center justify-center hover:bg-black cursor-pointer"
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <p className="text-[#F3FCFF] font-normal text-[14px] sm:text-[16px] mb-4 text-center max-w-[250px] mx-auto">
                {tool.uploadHint}
              </p>
              <span className="flex items-center gap-2 border border-[#F3F3F3] bg-[#F3F3F3] rounded-full px-4 py-2 text-[13px] font-medium text-[#12171B]">
                <Image
                  src="/svgs/Upload-image-icon.svg"
                  alt="upload"
                  width={16}
                  height={16}
                  className="object-contain shrink-0"
                />
                Upload Photo
              </span>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
        <input
          ref={colorInputRef}
          type="color"
          className="hidden"
          onChange={(e) => {
            setPickedColor(e.target.value);
            setSelectedColor("Pick Color");
          }}
        />
        {tool.id === "remove-object" && (
          <div className="mt-2">
            <h4 className="text-[16px] font-semibold text-white mb-3">
              Describe What to Remove
            </h4>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Remove the person in background..."
              className="w-full rounded-2xl p-4 text-white text-[14px] placeholder-white/40 resize-none outline-none transition-colors"
              style={{
                border: "1.5px dotted rgba(59,127,255,0.6)",
              }}
              rows={3}
            />
          </div>
        )}
        {tool.showColors && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[16px] font-semibold text-[#F3FCFF]">
                Solid Color Background
              </h4>
              <button
                onClick={() => setPopup("color")}
                className="text-[13px] font-medium cursor-pointer bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] bg-clip-text text-transparent"
              >
                View All &gt;
              </button>
            </div>
            <div
              ref={colorScrollRef}
              className="flex overflow-x-auto scrollbar-hide pb-1 gap-3 snap-x snap-mandatory rounded-2xl px-2"
            >
              {colors.map((c) => (
                <button
                  key={c.label}
                  onClick={() => {
                    if (c.isPicker) {
                      colorInputRef.current?.click();
                    } else {
                      setSelectedColor(c.label);
                      setSelectedColorHex(c.swatches[0]);
                    }
                  }}
                  className="flex flex-col items-center gap-1 cursor-pointer w-[88px] flex-none snap-start"
                >
                  <div
                    className={`w-20 h-20 rounded-2xl border-2 transition overflow-hidden
                    ${selectedColor === c.label ? "border-[#3B7FFF] shadow-md" : "border-transparent"}`}
                  >
                    {c.isTransparent ? (
                      <img
                        src="/images/remove-object/transparent-bg.png"
                        alt="Transparent"
                        className="w-full h-full object-cover"
                      />
                    ) : c.isSurprise ? (
                      <img
                        src="/images/remove-object/surprise.png"
                        alt="Surprise Me"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{
                          background:
                            c.isPicker && selectedColor === "Pick Color"
                              ? pickedColor
                              : c.isPicker
                                ? `conic-gradient(${c.swatches.join(", ")})`
                                : c.swatches.length === 1
                                  ? c.swatches[0]
                                  : `conic-gradient(${c.swatches.join(", ")})`,
                        }}
                      />
                    )}
                  </div>
                  <span
                    className={`text-[14px] font-medium text-center leading-tight max-w-[64px] transition-colors duration-300 ${selectedColor === c.label ? "bg-clip-text text-transparent bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78]" : "text-[#F3FCFF]"}`}
                  >
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {tool.showColors && popup === "color" && (
        <ViewAllPopup title="Select Color" onClose={() => setPopup(null)}>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 ">
            {colors.map((c) => (
              <button
                key={c.label}
                onClick={() => {
                  if (c.isPicker) {
                    colorInputRef.current?.click();
                  } else {
                    setSelectedColor(c.label);
                    setPopup(null);
                    scrollToSelected(colorScrollRef, c.label, colors);
                  }
                }}
                className="flex flex-col items-center gap-1 cursor-pointer"
              >
                <div
                  className={`w-20 h-20 rounded-2xl border-2 transition overflow-hidden
                  ${selectedColor === c.label ? "border-[#3B7FFF] shadow-md" : "border-transparent"}`}
                >
                  {c.isTransparent ? (
                    <img
                      src="/images/remove-object/transparent-bg.png"
                      alt="Transparent"
                      className="w-full h-full object-cover"
                    />
                  ) : c.isSurprise ? (
                    <img
                      src="/images/remove-object/surprise.png"
                      alt="Surprise Me"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{
                        background:
                          c.swatches.length === 1
                            ? c.swatches[0]
                            : `conic-gradient(${c.swatches.join(", ")})`,
                      }}
                    />
                  )}
                </div>
                <span
                  className={`text-[14px] font-medium text-center leading-tight max-w-[64px] transition-colors duration-300 ${selectedColor === c.label ? "bg-clip-text text-transparent bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78]" : "text-[#F3FCFF]"}`}
                >
                  {c.label}
                </span>
              </button>
            ))}
          </div>
        </ViewAllPopup>
      )}

      <div className="flex-shrink-0 bg-[#12171B] flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className={`w-[500px] py-3 rounded-full font-semibold text-[18px] text-[#F3F3F3] transition flex items-center justify-center gap-2
            ${
              canGenerate
                ? "bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] cursor-pointer hover:opacity-90"
                : "bg-gray-600 cursor-not-allowed opacity-50"
            }`}
        >
          {loading ? (
            "Processing..."
          ) : (
            <>
              <Image
                src="/svgs/generate-icon.svg"
                alt="Generate"
                width={20}
                height={20}
                className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px] object-contain"
              />
              {tool.buttonLabel}
            </>
          )}
        </button>
      </div>
      {showResult && (
        <ResultPopup
          tool={tool}
          uploadedImage={uploadedImage}
          beforeImage={beforeImage}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  );
};

// ─── Tool Card (Screen 1) ─────────────────────────────────────────────────────
const ToolCard = ({ tool, onClick }) => (
  <div
    onClick={() => onClick(tool)}
    className="relative bg-[#1D2933] rounded-4xl overflow-hidden cursor-pointer"
  >
    {" "}
    <div className="relative w-full h-48 sm:h-50">
      <Image
        src={tool.previewImage}
        alt={tool.label}
        fill
        className="object-cover rounded-b-2xl "
      />
    </div>
    <div className="p-2 flex items-center justify-between">
      <div className="ml-4">
        <h4 className="text-[18px] font-semibold mb-1 bg-gradient-to-r from-[#2CAA78] to-[#3B7FFF] bg-clip-text text-transparent">
          {tool.label}
        </h4>
        <p className="text-white/70 text-[15px] mb-2">{tool.description}</p>
      </div>
    </div>
  </div>
);

// ─── Main Component (Screen 1) ────────────────────────────────────────────────
const PhotoTools = ({ onMessageSent }) => {
  const [selectedTool, setSelectedTool] = useState(null);

  if (selectedTool) {
    return (
      <UploadScreen
        tool={selectedTool}
        onBack={() => setSelectedTool(null)}
        onMessageSent={onMessageSent}
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide gap-4 p-2 pb-6">
      <p className="text-[12px] font-semibold text-white uppercase tracking-widest">
        Select a Tool to Get Started
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onClick={setSelectedTool} />
        ))}
      </div>
    </div>
  );
};

export default PhotoTools;
