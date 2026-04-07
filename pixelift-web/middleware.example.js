// Optional (NOT enabled) root-only middleware example.
//
// Why it's optional:
// - You asked to prefer client-side detection to avoid Vercel Edge costs.
// - If you later want *true* country-based redirects (IP-derived), middleware is the standard way.
//
// IMPORTANT:
// - This file is named `middleware.example.js` so Next.js will NOT run it.
// - If you decide to enable it, rename it to `middleware.js`.
// - It is strictly limited to `/` and never touches locale routes.
//
import { NextResponse } from "next/server";

// Keep in sync with `src/lib/locales.js`.
// Middleware is only needed if you want true IP-based country detection.
const DEFAULT_LOCALE = "us";

const COUNTRY_TO_LOCALE = {
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
  US: "us",
};

export function middleware(request) {
  if (request.nextUrl.pathname !== "/") return NextResponse.next();

  // Manual opt-out for debugging.
  if (request.nextUrl.searchParams.has("no-redirect")) return NextResponse.next();

  const country =
    request.geo?.country ||
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry");

  const locale = country ? COUNTRY_TO_LOCALE[String(country).toUpperCase()] : undefined;
  if (!locale) return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));

  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}

export const config = {
  matcher: ["/"],
};
