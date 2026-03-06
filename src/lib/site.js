export const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.aisoulmatedrawings.com";

export function absoluteUrl(pathname = "/") {
  try {
    return new URL(pathname, SITE_URL).toString();
  } catch {
    return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  }
}
