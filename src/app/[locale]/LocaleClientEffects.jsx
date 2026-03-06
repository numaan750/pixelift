"use client";

import { useEffect } from "react";

const langMap = {
  us: "en-US",
  ru: "ru-RU",
  de: "de-DE",
  uk: "en-GB",
  cn: "zh-CN",
  br: "pt-BR",
  jp: "ja-JP",
  mx: "es-MX",
  fr: "fr-FR",
  vn: "vi-VN",
  it: "it-IT",
  sa: "ar-SA",
};

export default function LocaleClientEffects({ locale }) {
  useEffect(() => {
    const normalized = String(locale || "us").toLowerCase();

    // Persist user choice so future / visits respect it.
    document.cookie = `preferred_locale=${normalized}; Path=/; Max-Age=31536000; SameSite=Lax`;

    // Direction + language (client-side).
    document.documentElement.dir = normalized === "sa" ? "rtl" : "ltr";
    document.documentElement.lang = langMap[normalized] || "en";
  }, [locale]);

  return null;
}
