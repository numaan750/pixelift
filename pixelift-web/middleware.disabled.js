import { NextResponse } from "next/server";

const COUNTRY_TO_PATH = {
  US: "/us",
  RU: "/ru",
  DE: "/de",
  GB: "/uk",
  CN: "/cn",
  BR: "/br",
  JP: "/jp",
  MX: "/mx",
  FR: "/fr",
  VN: "/vn",
  IT: "/it",
  SA: "/sa",
};

const PATH_TO_COUNTRY = Object.fromEntries(
  Object.entries(COUNTRY_TO_PATH).map(([country, path]) => [path, country])
);

function isBot(userAgent) {
  return /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot/i.test(userAgent || "");
}

function normalizeCountry(value) {
  if (!value) return undefined;
  const match = /([A-Za-z]{2})/.exec(String(value).trim());
  return match?.[1]?.toUpperCase();
}

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;

  // Normalize trailing slashes for matching.
  const path = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;

  // Allow disabling redirects for debugging.
  if (searchParams.has("no-redirect")) return NextResponse.next();

  // Never redirect search engine bots.
  const ua = request.headers.get("user-agent") || "";
  if (isBot(ua)) return NextResponse.next();

  // Debug helper (no redirect): shows what country headers Vercel/CF provide.
  // Use: /?geo_debug=1
  if (searchParams.has("geo_debug")) {
    const xVercel = request.headers.get("x-vercel-ip-country");
    const cf = request.headers.get("cf-ipcountry");
    const geo = request.geo?.country;
    const detected = normalizeCountry(xVercel || cf) || null;
    return NextResponse.json(
      {
        pathname,
        xVercelIpCountry: xVercel,
        cfIpCountry: cf,
        requestGeoCountry: geo,
        detectedCountry: detected,
        userAgent: ua,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  // Detect country from headers only (per requirement).
  const headerCountry =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry");

  const country = normalizeCountry(headerCountry) || normalizeCountry(request.geo?.country);

  const expectedPath = country ? COUNTRY_TO_PATH[country] : undefined;

  // Root: redirect into a supported locale if known.
  if (path === "/") {
    if (!expectedPath) return NextResponse.next();

    const res = NextResponse.redirect(new URL(expectedPath, request.url));
    res.headers.set("Cache-Control", "private, no-store, max-age=0");
    res.headers.set("Vary", "x-vercel-ip-country, cf-ipcountry, user-agent");
    return res;
  }

  // Visiting a supported locale that doesn't match detected locale.
  // Example: user in GB visits /de -> redirect to /uk
  if (path in PATH_TO_COUNTRY) {
    if (!expectedPath) return NextResponse.next();
    if (path === expectedPath) return NextResponse.next();

    const url = request.nextUrl.clone();
    url.pathname = expectedPath;

    const res = NextResponse.redirect(url);
    res.headers.set("Cache-Control", "private, no-store, max-age=0");
    res.headers.set("Vary", "x-vercel-ip-country, cf-ipcountry, user-agent");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/(us|ru|de|uk|cn|br|jp|mx|fr|vn|it|sa)"],
};
