export function normalizeAltText(value) {
  if (typeof value !== "string") return "";

  let text = value.trim();

  // If it's a path like /home-images/Foo-Bar.webp, use just the basename.
  const lastSlash = text.lastIndexOf("/");
  if (lastSlash !== -1) {
    text = text.slice(lastSlash + 1);
  }

  // Remove common image extensions
  text = text.replace(/\.(png|webp|jpe?g|svg|gif)$/i, "");

  // Replace dashes/underscores with spaces
  text = text.replace(/[-_]+/g, " ");

  // Remove numeric suffixes and standalone numbers (e.g. "FAQ2" -> "FAQ", "Explore2" -> "Explore")
  text = text.replace(/(\p{L})\d+\b/gu, "$1");
  text = text.replace(/\b\d+\b/g, " ");

  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

const DEFAULT_ALT_BY_LOCALE = {
  us: "Image",
  uk: "Image",
  de: "Bild",
  fr: "Image",
  it: "Immagine",
  br: "Imagem",
  mx: "Imagen",
  cn: "图片",
  jp: "画像",
  ru: "Изображение",
  sa: "صورة",
  vn: "Hình ảnh",
};

function localizedFallback(locale) {
  const code = typeof locale === "string" ? locale.toLowerCase() : "";
  return DEFAULT_ALT_BY_LOCALE[code] || "Image";
}

export function altFromSrcOrAlt({ alt, src, fallback, locale } = {}) {
  const fromAlt = normalizeAltText(alt);
  if (fromAlt) return fromAlt;

  const fromSrc = normalizeAltText(src);
  if (fromSrc) return fromSrc;

  return fallback ?? localizedFallback(locale);
}
