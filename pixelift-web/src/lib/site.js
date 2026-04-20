export const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.pixelift.com";

export function absoluteUrl(pathname = "/") {
  try {
    return new URL(pathname, SITE_URL).toString();
  } catch {
    return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  }
}

export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@pixelift.com";

export const PUBLIC_PRICING = [
  {
    id: "yearly",
    name: "Yearly Plan",
    price: " $30.00",
    cadence: "per year",
    summary: "$2.50/month billed annually.",
    renewal: "Auto-renews yearly until cancelled.",
  },
  {
    id: "monthly",
    name: "Weekly Plan",
    price: "$11.95",
    cadence: "per week",
    summary: "Flexible weekly access.",
    renewal: "Auto-renews weekly until cancelled.",
  },
];

export const APP_SUBSCRIPTIONS_URL =
  "https://apps.apple.com/account/subscriptions";
