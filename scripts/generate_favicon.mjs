import fs from "node:fs";
import path from "node:path";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const ROOT = process.cwd();
const publicIconPng = path.join(ROOT, "public", "icon.png");
const appIconPng = path.join(ROOT, "src", "app", "icon.png");

const publicFaviconIco = path.join(ROOT, "public", "favicon.ico");
const appFaviconIco = path.join(ROOT, "src", "app", "favicon.ico");

const fallbackWebp = path.join(ROOT, "public", "USImages", "Sulmate.webp");

const publicAppleTouchIcon = path.join(ROOT, "public", "apple-touch-icon.png");
const appAppleTouchIcon = path.join(ROOT, "src", "app", "apple-touch-icon.png");

function isPng(buf) {
  return buf?.length >= 8 && buf.slice(0, 4).toString("hex") === "89504e47";
}

async function makeSquarePngBufferFromWebp(webpPath, size) {
  return sharp(webpPath)
    .resize(size, size, { fit: "cover" })
    .png()
    .toBuffer();
}

async function main() {
  let iconPngBuf = null;

  if (fs.existsSync(publicIconPng)) {
    const buf = fs.readFileSync(publicIconPng);
    if (isPng(buf)) iconPngBuf = buf;
  }

  // If icon.png is missing or invalid, fall back to the existing WEBP logo.
  if (!iconPngBuf && fs.existsSync(fallbackWebp)) {
    iconPngBuf = await makeSquarePngBufferFromWebp(fallbackWebp, 1024);
  }

  if (!iconPngBuf) {
    throw new Error(
      "Could not find a valid PNG source. Provide public/icon.png (PNG) or ensure public/USImages/Sulmate.webp exists."
    );
  }

  // Ensure icon.png exists and is a real PNG.
  fs.writeFileSync(publicIconPng, iconPngBuf);

  // Keep a copy under src/app so Next can also emit it via file conventions.
  fs.mkdirSync(path.dirname(appIconPng), { recursive: true });
  fs.writeFileSync(appIconPng, iconPngBuf);

  // Generate a standard 180x180 Apple touch icon.
  const appleTouchBuf = await sharp(iconPngBuf)
    .resize(180, 180, { fit: "cover" })
    .png()
    .toBuffer();
  fs.writeFileSync(publicAppleTouchIcon, appleTouchBuf);
  fs.copyFileSync(publicAppleTouchIcon, appAppleTouchIcon);

  // Generate a real ICO file for /favicon.ico
  const icoBuf = await pngToIco([publicIconPng]);

  fs.writeFileSync(publicFaviconIco, icoBuf);
  fs.writeFileSync(appFaviconIco, icoBuf);

  console.log("Generated:");
  console.log("- public/icon.png");
  console.log("- public/favicon.ico (real ICO)");
  console.log("- src/app/icon.png");
  console.log("- public/apple-touch-icon.png");
  console.log("- src/app/apple-touch-icon.png");
  console.log("- src/app/favicon.ico (real ICO)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
