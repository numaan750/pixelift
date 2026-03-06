"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, isSupportedLocale } from "@/lib/locales";

function getCookie(name) {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length !== 2) return undefined;
  return parts.pop()?.split(";")?.shift();
}

// Prefer client-side detection to avoid Edge/middleware costs.
// Note: without an IP-based signal, this can only infer *likely* country via locale/region.
const REGION_TO_LOCALE = {
  US: "us",
  GB: "uk",
  UK: "uk",
  DE: "de",
  RU: "ru",
  FR: "fr",
  IT: "it",
  BR: "br",
  CN: "cn",
  JP: "jp",
  MX: "mx",
  VN: "vn",
  SA: "sa",
};

function parseRegionFromLocaleTag(tag) {
  // Examples: "en-GB", "de-DE", "ru-RU".
  // We only care about the region part.
  const normalized = String(tag || "").replace("_", "-").trim();
  const parts = normalized.split("-");
  // Common structure: language-region, region is 2 letters.
  const maybeRegion = parts.find((p) => /^[A-Za-z]{2}$/.test(p));
  return maybeRegion ? maybeRegion.toUpperCase() : undefined;
}

function detectLocaleFromClient(supported) {
  const candidates = [];

  if (typeof Intl !== "undefined") {
    const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (intlLocale) candidates.push(intlLocale);
  }

  if (typeof navigator !== "undefined") {
    if (Array.isArray(navigator.languages)) candidates.push(...navigator.languages);
    if (navigator.language) candidates.push(navigator.language);
  }

  for (const tag of candidates) {
    const region = parseRegionFromLocaleTag(tag);
    if (!region) continue;
    const mapped = REGION_TO_LOCALE[region];
    if (mapped && supported.has(mapped)) return mapped;
  }

  return undefined;
}

export default function RootRedirect() {
  const router = useRouter();
  const didRunRef = useRef(false);

  // Allowlist guard: redirects must only ever target known locale routes.
  const supported = useMemo(() => new Set(SUPPORTED_LOCALES), []);

  useEffect(() => {
    // Runs only on the root page (because RootRedirect is only mounted on '/').
    // Guard so it runs once per mount and doesn't loop.
    if (didRunRef.current) return;
    didRunRef.current = true;

    const params =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : undefined;
    if (params?.has("no-redirect")) return;

    const cookieLocale = (getCookie("preferred_locale") || "").toLowerCase();
    const preferred = isSupportedLocale(cookieLocale) ? cookieLocale : undefined;

    // Never redirect when the user directly visits a locale path.
    // (RootRedirect is only rendered on '/', but keep this as an extra safeguard.)
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path && path !== "/") return;
    }

    // Respect the user's previous explicit choice.
    if (preferred) {
      router.replace(`/${preferred}`);
      return;
    }

    const detected = detectLocaleFromClient(supported);
    const target = detected && isSupportedLocale(detected) ? detected : DEFAULT_LOCALE;

    // Dev-only logging to verify detection without affecting production.
    if (process.env.NODE_ENV === "development") {
      console.log("[root redirect] detected:", detected, "→ target:", target);
    }

    // Safe fallback: if we can't confidently detect a supported locale,
    // redirect to a known-good default route (DEFAULT_LOCALE).
    router.replace(`/${target}`);
  }, [router, supported]);

  return null;
}
