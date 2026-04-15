"use client";
import Image from "next/image";
import { useState, useRef, useContext } from "react";
import HomeAuraLoadingScreen from "../PixeliftLoadingScreen";
import { RiEdit2Fill } from "react-icons/ri";
import { IoShareSocialSharp } from "react-icons/io5";
import { GiSaveArrow } from "react-icons/gi";
import { AppContext } from "@/context/Appcontext";

const tools = [
  {
    id: "cartoonify",
    label: "Cartoonify",
    description: "Turn photos into vibrant cartoon art",
    uploadHint: "Upload your photo for instant cartoonification",
    buttonLabel: "Cartoonify with AI",
    bg: "#1D2933",
    icon: "/svgs/tools/ai-photo-enhancer.svg",
    previewImage: "/images/fun-preset/Cartoonify.png",
  },
  {
    id: "hair-cut",
    label: "Hair Cut",
    description: "Change the haircut of the subject",
    uploadHint: "Upload your photo for instant hair cut",
    buttonLabel: "Hair Cut",
    bg: "#1D2933",
    icon: "/svgs/tools/move-camera.svg",
    previewImage: "/images/fun-preset/hair-cut.png",
  },
  {
    id: "movie-poster",
    label: "Movie Poster",
    description: "Turn your photos into movie posters",
    uploadHint: "Upload your photo to create a movie poster",
    buttonLabel: "Movie Poster",
    bg: "#1D2933",
    icon: "/svgs/tools/relight.svg",
    previewImage: "/images/fun-preset/movie-poster.png",
  },
  {
    id: "turn-into-avatar",
    label: "Turn into Avatar",
    description: "Create stunning, AI-powered profile avatars",
    uploadHint: "Upload your photo to create an avatar",
    buttonLabel: "Turn into Avatar",
    bg: "#1D2933",
    icon: "/svgs/tools/product-photo.svg",
    previewImage: "/images/fun-preset/turn-into-avatar.png",
  },
  {
    id: "body-builder",
    label: "Body Builder",
    description: "Add muscle definition to your physique",
    uploadHint: "Upload your photo to create a body builder",
    buttonLabel: "Body Builder",
    bg: "#1D2933",
    icon: "/svgs/tools/zoom.svg",
    previewImage: "/images/fun-preset/body-builder.png",
  },
];

const styles = [
  { label: "Suprise Me", image: "/images/fun-preset/Avatar/Surprise-Me.png" },
  { label: "Anime", image: "/images/fun-preset/Avatar/Anime.png" },
  { label: "Sketch", image: "/images/fun-preset/Avatar/Sketch.png" },
  { label: "Cartoon", image: "/images/fun-preset/Avatar/Avatar-Cartoon.png" },
  { label: "3D Avatar", image: "/images/fun-preset/Avatar/3D-Avatar.png" },
  { label: "Line Art", image: "/images/fun-preset/Avatar/Line-Art.png" },
  { label: "Water Color", image: "/images/fun-preset/Avatar/Water-Color.png" },
  { label: "Futuristic", image: "/images/fun-preset/Avatar/Futuristic.png" },
];

const ViewAllPopup = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="bg-[#12171B] rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
      <div className="flex items-center justify-between p-5 border-b border-[#ABD8FC80]">
        <h3 className="text-[18px] font-bold text-white">{title}</h3>
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

// ─── Result screen ─────────────────────────────────────────────────────────────
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

// ─── Edit screen ─────────────────────────────────────────────────────────────
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
            className="w-full bg-gradient-to-b from-[#3B7FFF]/20 to-[#2CAA78]/20 border border-[#ABD8FC80] text-white text-[14px] rounded-2xl p-4 focus:border-[#3B7FFF] outline-none resize-none placeholder:text-white/40"
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
  const [selectedStyle, setSelectedStyle] = useState("Anime");
  const [selectedStyleImage, setSelectedStyleImage] = useState(
    "/images/avatar-styles/anime.png",
  );
  const [popup, setPopup] = useState(null);
  const styleScrollRef = useRef(null);
  const [beforeImage, setBeforeImage] = useState(null);

  const scrollToSelected = (ref, label, list) => {
    const index = list.findIndex((s) => s.label === label);
    if (ref.current && index !== -1) {
      ref.current.children[index]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }
  };
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

      let toolOptions = {};
      if (tool.id === "turn-into-avatar") {
        toolOptions = { style: selectedStyle };
      }
      if (tool.id === "hair-cut") {
        toolOptions = { hairstyle: "modern stylish" };
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
            section: "fun-presets",
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
        </div>
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

        {tool.id === "turn-into-avatar" && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[16px] font-semibold text-white">
                Select Style
              </h4>
              <button
                onClick={() => setPopup("style")}
                className="text-[13px] font-medium cursor-pointer bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] bg-clip-text text-transparent"
              >
                View All &gt;
              </button>
            </div>
            <div
              ref={styleScrollRef}
              className="flex overflow-x-auto scrollbar-hide pb-1 gap-3 snap-x snap-mandatory rounded-2xl px-2"
            >
              {styles.map((s) => (
                <button
                  key={s.label}
                  onClick={() => {
                    setSelectedStyle(s.label);
                    setSelectedStyleImage(s.image);
                  }}
                  className="flex flex-col items-center gap-1 cursor-pointer w-[88px] flex-none snap-start"
                >
                  <div
                    className={`w-20 h-20 rounded-2xl overflow-hidden transition border-2
                    ${selectedStyle === s.label ? "border-[#3B7FFF] shadow-md" : "border-transparent"}`}
                  >
                    <Image
                      src={s.image}
                      alt={s.label}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span
                    className={`text-[14px] font-medium text-center transition-colors duration-300 ${selectedStyle === s.label ? "bg-clip-text text-transparent bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78]" : "text-[#F3FCFF]"}`}
                  >
                    {s.label}
                  </span>
                </button>
              ))}
            </div>

            {popup === "style" && (
              <ViewAllPopup title="Select Style" onClose={() => setPopup(null)}>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {styles.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => {
                        setSelectedStyle(s.label);
                        setSelectedStyleImage(s.image);
                        setPopup(null);
                        scrollToSelected(styleScrollRef, s.label, styles);
                      }}
                      className="flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <div
                        className={`w-20 h-20 rounded-2xl overflow-hidden transition border-2
                        ${selectedStyle === s.label ? "border-[#3B7FFF] shadow-md" : "border-transparent"}`}
                      >
                        <Image
                          src={s.image}
                          alt={s.label}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <span
                        className={`text-[14px] font-medium text-center transition-colors duration-300 ${selectedStyle === s.label ? "bg-clip-text text-transparent bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78]" : "text-[#F3FCFF]"}`}
                      >
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              </ViewAllPopup>
            )}
          </div>
        )}
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
    className="relative bg-[#1D2933] [40px] sm:rounded-[45px] overflow-hidden cursor-pointer"
  >
    {" "}
    <div className="relative w-full aspect-[15/10]">
      <Image
        src={tool.previewImage}
        alt={tool.label}
        fill
        className="object-contain "
      />
    </div>
    <div className="p-2 flex items-center justify-between">
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

