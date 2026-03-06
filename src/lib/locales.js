// Single source of truth for supported locale routes.
//
// Why this exists:
// - Safety: prevents malformed/unknown locale strings from triggering redirects.
// - SEO: ensures we only generate and link canonical/hreflang URLs we actually serve.
//
// Keep this list in sync with `src/app/constants/*` and `src/lib/countries`.
export const SUPPORTED_LOCALES = [
  "uk",
  "de",
  "ru",
  "fr",
  "it",
  "br",
  "cn",
  "jp",
  "mx",
  "vn",
  "sa",
  "us",
];

export const DEFAULT_LOCALE = "us";

export function isSupportedLocale(value) {
  if (typeof value !== "string") return false;
  const normalized = value.toLowerCase();
  // Strictly allow only 2-letter locales we explicitly support.
  if (!/^[a-z]{2}$/.test(normalized)) return false;
  return SUPPORTED_LOCALES.includes(normalized);
}
