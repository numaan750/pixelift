import { v2 as cloudinary } from "cloudinary";
import fetch from "node-fetch";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DASH_SCOPE_API_URL = process.env.CURL_lOCATION;

const buildPrompt = ({ toolId, toolOptions = {} }) => {
  if (toolOptions.editPrompt) {
    return toolOptions.editPrompt;
  }
  
  switch (toolId) {
    // ── Image Utilities ──────────────────────────────────────────────────────
    case "ai-photo-enhancer":
      return "Enhance the image quality with better details, sharpness, and clarity, make the image attractive.";

    case "move-camera":
      return "Adjust the camera perspective to a new viewpoint.";

    case "relight":
      return "Relight naturally with subtle depth and a refined background.";

    case "product-photo":
      return "Professional commercial product photography, suitable and attractive background, bokeh, elegant compositions, high-end advertising style, highly detailed textures.";

    case "zoom":
      return toolOptions.prompt
        ? `Zoom on ${toolOptions.prompt} object from the uploaded image. Maintain the object complete when zoom.`
        : "Zoom on object which makes the image attractive and better.";

    case "colorize":
      return "Add natural colors to the uploaded black-and-white image.";

    // ── Magic Remove ─────────────────────────────────────────────────────────
    case "background-remover":
      if (toolOptions.backgroundColor === "transparent") {
        return "Remove the background and keep only the main subject. Make sure add the background color will be transparent";
      }
      if (toolOptions.backgroundColor === "surprise") {
        return "Remove the background and keep only the main subject. Make sure add the background color will be surprise colorful creative";
      }
      return `Remove the background and keep only the main subject. Make sure add the background color will be ${toolOptions.backgroundColor || "white"}`;

    case "remove-object":
      return `Remove the ${toolOptions.prompt || "unwanted object"} object from uploaded image.`;

    case "remove-text":
      return toolOptions.prompt
        ? `Remove the ${toolOptions.prompt} text only from the uploaded image`
        : "Remove complete text only from the uploaded image.";

    // ── Fun Presets ───────────────────────────────────────────────────────────
    case "cartoonify":
      return "Transform this image into a complete cartoon-style image.";

    case "hair-cut":
      return "Modify only the hairstyle of the person in the image, giving them a modern and attractive haircut. Keep facial features, pose, and background unchanged.";

    case "movie-poster":
      return toolOptions.prompt
        ? `Transform this image into a attractive, realistic movie poster with a ${toolOptions.prompt} theme. Make sure the background should be changed and attractive.`
        : "Turn the person into a digital avatar and compose the image as a cinematic movie poster, featuring dramatic lighting, a stylized background, centered hero pose, cinematic color grading, and no text.";

    case "turn-into-avatar":
      return `Turn the person into a digital avatar version of themselves. Make sure the style must be ${toolOptions.style}`;

    case "body-builder":
      return `Transform the person into a muscular bodybuilder physique while preserving the same face, identity, pose, and lighting.
              Increase muscle mass naturally with well-defined chest, broad shoulders, thick arms, visible biceps and triceps, strong forearms,
              pronounced deltoids, wide back, defined abs, and powerful legs.
              Maintain realistic human anatomy, natural skin texture, proportional body structure, and photorealistic details.
              Keep the same facial features and expression.`;

    default:
      return "Edit the photo as requested.";
  }
};
export const generatePixeliftImage = async ({
  toolId,
  toolOptions = {},
  uploadedImage,
}) => {
  try {
    const prompt = buildPrompt({ toolId, toolOptions });

    const body = {
      model: process.env.DASHSCOPE_MODEL,
      input: {
        messages: [
          {
            role: "user",
            content: [
              { text: prompt },
              ...(uploadedImage ? [{ image: uploadedImage }] : []),
            ],
          },
        ],
      },
      parameters: {
        negative_prompt: "",
        watermark: false,
        width: 512,
        height: 512,
      },
    };

    const response = await fetch(DASH_SCOPE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.DASHSCOPE_API_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("DashScope API Error:", data);
      throw new Error("Image generation failed");
    }
    const imageUrl = data?.output?.choices?.[0]?.message?.content?.[0]?.image;
    if (!imageUrl) throw new Error("No image returned from API");
    const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
      folder: "pixelift",
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Pixelift Image Generation Error:", error);
    throw error;
  }
};
