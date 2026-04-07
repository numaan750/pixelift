"use client";
import Image from "next/image";
import { useState, useRef, useContext } from "react";
import HomeAuraLoadingScreen from "../PixeliftLoadingScreen";
import { AppContext } from "@/context/Appcontext";
import { RiEdit2Fill } from "react-icons/ri";
import { IoShareSocialSharp } from "react-icons/io5";
import { GiSaveArrow } from "react-icons/gi";

const tools = [
  {
    id: "ai-photo-enhancer",
    label: "AI Photo Enhancer",
    description: "Make old, blurry photos sharp & vibrant in just seconds.",
    uploadHint: "Upload your photo for instant enhancement",
    buttonLabel: "Enhance with AI",
    bg: "#1D2933",
    icon: "/svgs/tools/ai-photo-enhancer.svg",
    previewImage: "/images/Enhance/ai-photo-enhancer.png",
  },
  {
    id: "move-camera",
    label: "Move Camera",
    description: "Move the camera to reveal new aspects of a scene.",
    uploadHint: "Upload your photo to move the camera",
    buttonLabel: "Move Camera",
    bg: "#1D2933",
    icon: "/svgs/tools/move-camera.svg",
    previewImage: "/images/Enhance/move-camera.png",
  },
  {
    id: "relight",
    label: "Relight",
    description: "Relight and brilliantly transform your stunning photos.",
    uploadHint: "Upload your photo to relight the scene",
    buttonLabel: "Relight Photo",
    bg: "#1D2933",
    icon: "/svgs/tools/relight.svg",
    previewImage: "/images/Enhance/relight.png",
  },
  {
    id: "product-photo",
    label: "Product Photo",
    description: "Turn your photos into professional product photos.",
    uploadHint: "Upload your product photo",
    buttonLabel: "Generate Product Photo",
    bg: "#1D2933",
    icon: "/svgs/tools/Product-Photo.svg",
    previewImage:
      "/images/Enhance/Turn-your-photos-into-professional-product-photos..png",
  },
  {
    id: "zoom",
    label: "Zoom",
    description: "Enlarge without losing image quality.",
    uploadHint: "Upload your photo to zoom & upscale",
    buttonLabel: "Zoom & Upscale",
    bg: "#1D2933",
    icon: "/svgs/tools/zoom.svg",
    previewImage: "/images/Enhance/zoom.png",
  },
  {
    id: "colorize",
    label: "Colorize",
    description: "Bring vibrant new life to your photos.",
    uploadHint: "Upload your black & white photo",
    buttonLabel: "Colorize Photo",
    bg: "#1D2933",
    icon: "/svgs/tools/colorize.svg",
    previewImage: "/images/Enhance/colorize.png",
  },
];

// ─── Result Screen ─────────────────────────────────────────────────────────────
const ResultScreen = ({
  tool,
  uploadedImage,
  beforeImage,
  onClose,
  onEdit,
}) => {
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
        </div>{" "}
        <div
          ref={containerRef}
          className="relative rounded-xl overflow-hidden bg-gradient-to-b from-[#3B7FFF]/20 to-[#2CAA78]/20 border border-[#ABD8FC80] 
           h-[280px] sm:h-[320px] md:h-[360px]"
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
      </div>
      <div className="flex-shrink-0 bg-[#12171B] flex flex-col items-center gap-3 pt-4 pb-2 px-2">
        <div className="flex gap-3 w-full sm:w-[400px]">
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
            className="flex-1 py-2.5 sm:py-2 rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-semibold text-[15px] sm:text-[18px] flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition"
          >
            <IoShareSocialSharp /> Share
          </button>
          <button
            onClick={onEdit}
            className="flex-1 py-2.5 sm:py-2 rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-semibold text-[15px] sm:text-[18px] flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition"
          >
            <RiEdit2Fill /> Edit
          </button>
        </div>

        {/* Row 2 — SAVE */}
        <div className="flex w-full sm:w-[400px]">
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

// ─── Edit Screen (Screen 2) ─────────────────────────────────────────────────
const EditScreen = ({ tool, generatedImage, onBack, onMessageSent }) => {
  const { credits, setCredits, user, setUser } = useContext(AppContext);
  const [editPrompt, setEditPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [showResult, setShowResult] = useState(false);

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
            toolId: tool.id,
            section: "image-utilities",
            uploadedImage: generatedImage,
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
      setResultImage(data.imageUrl);
      setShowResult(true);
    } catch (error) {
      console.error("Edit error:", error);
      alert("Edit failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (showResult) {
    return (
      <ResultScreen
        tool={tool}
        uploadedImage={resultImage}
        beforeImage={generatedImage}
        onClose={onBack}
        onEdit={() => {
          setShowResult(false);
          setResultImage(null);
          setEditPrompt("");
        }}
      />
    );
  }

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
          className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#3B7FFF]/20 to-[#2CAA78]/20 border border-[#ABD8FC80]"
          style={{ height: "300px" }}
        >
          <img
            src={generatedImage}
            alt="generated"
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
            className="w-full bg-gradient-to-b from-[#3B7FFF]/20 to-[#2CAA78]/20 border border-[#ABD8FC80] text-white text-[14px] rounded-2xl p-4 border border-[#3B7FFF]/30 focus:border-[#3B7FFF] outline-none resize-none placeholder:text-white/40"
            rows={4}
          />
        </div>
      </div>
      <div className="flex-shrink-0 bg-[#12171B] flex justify-center">
        <button
          onClick={handleEditGenerate}
          disabled={!editPrompt.trim() || loading}
          className={`w-[500px] py-3 rounded-full font-semibold text-[18px] text-[#F3F3F3] transition flex items-center justify-center gap-2
            ${
              editPrompt.trim() && !loading
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
              Generate Edit
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── Upload Screen (Screen 2) ─────────────────────────────────────────────────
const UploadScreen = ({ tool, onBack, onMessageSent }) => {
  const { credits, setCredits, user, setUser } = useContext(AppContext);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [beforeImage, setBeforeImage] = useState(null);

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
    if (credits !== Infinity && credits <= 0) {
      onMessageSent && onMessageSent();
      return;
    }
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
            section: "image-utilities",
            uploadedImage: base64Image,
            toolOptions: {},
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

      setUploadedImage(data.imageUrl);
      setShowResult(true);
    } catch (error) {
      console.error("Generation error:", error);
      alert("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canGenerate = !!uploadedFile && !loading;

  if (showEdit) {
    return (
      <EditScreen
        tool={tool}
        generatedImage={uploadedImage}
        onBack={() => {
          setShowEdit(false);
          setShowResult(true);
        }}
        onMessageSent={onMessageSent}
      />
    );
  }

  if (showResult) {
    return (
      <ResultScreen
        tool={tool}
        uploadedImage={uploadedImage}
        beforeImage={beforeImage}
        onClose={() => setShowResult(false)}
        onEdit={() => {
          setShowResult(false);
          setShowEdit(true);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {loading && <HomeAuraLoadingScreen />}
      <div className="flex-1 overflow-y-auto scrollbar-hide gap-4 pb-4 flex flex-col">
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
          <h4 className="text-[16px] font-semibold text-white">Add A Photo</h4>
        </div>{" "}
        <div
          onClick={() => !uploadedImage && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#3B7FFF]/20 to-[#2CAA78]/20 border-2 rounded-3xl p-6 transition-all
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
      </div>

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
    </div>
  );
};

// ─── Tool Card (Screen 1) ─────────────────────────────────────────────────────
const ToolCard = ({ tool, onClick }) => (
  <div
    onClick={() => onClick(tool)}
    className="relative bg-[#1D2933] rounded-[40px] sm:rounded-[45px] overflow-hidden cursor-pointer"
  >
    {" "}
    <div className="relative w-full aspect-[15/10]">
      <Image
        src={tool.previewImage}
        alt={tool.label}
        fill
        className="object-cover rounded-b-2xl "
      />
    </div>
    <div className="p-2 flex items-center justify-between mb-2">
      <div className="ml-4">
        <h4 className="text-[18px] font-semibold mb-1 bg-gradient-to-r from-[#2CAA78] to-[#3B7FFF] bg-clip-text text-transparent">
          {tool.label}
        </h4>
        <p className="text-white/70 text-[15px]">{tool.description}</p>
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
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide gap-4 pb-6">
      <p className="text-[16px] font-semibold text-white">
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
