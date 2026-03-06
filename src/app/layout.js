import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import { AppContextProvider } from "./context/AppContext";
import LayoutClient from "./LayoutClient";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import { hreflangLanguages } from "@/lib/countries";
import { altFromSrcOrAlt } from "@/lib/altText";
import { seo, BRAND, formatMetaDescription } from "@/lib/seo";
import { safeJsonLdStringify } from "@/lib/structuredData";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: seo.us.title,
  description: formatMetaDescription(seo.us.description, "us"),
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png" }],
  },
  keywords: [
    "AI soulmate drawing",
    "AI soulmate drawings",
    "future partner sketch",
    "romantic AI portrait",
    "AI couple portrait",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    languages: hreflangLanguages,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: BRAND,
    title: seo.us.title,
    description: formatMetaDescription(seo.us.description, "us"),
    images: [
      {
        url: "/home-images/See-What-Your-Soulmate-Looks-Like.webp",
        width: 1200,
        height: 630,
        alt: altFromSrcOrAlt({ alt: "See-What-Your-Soulmate-Looks-Like.webp" }),
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.us.title,
    description: formatMetaDescription(seo.us.description, "us"),
    images: [
      {
        url: "/home-images/See-What-Your-Soulmate-Looks-Like.webp",
        alt: altFromSrcOrAlt({ alt: "See-What-Your-Soulmate-Looks-Like.webp" }),
      },
    ],
  },
};

export default function RootLayout({ children }) {
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}#organization`,
        name: BRAND,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/icon.png"),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        url: SITE_URL,
        name: BRAND,
        publisher: {
          "@id": `${SITE_URL}#organization`,
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* GA4 - Google tag */}
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-TLXZBCP1NP"
        />
        <Script
          id="ga4-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TLXZBCP1NP', {
                anonymize_ip: true,
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        <script
          id="structured-data-site"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(siteJsonLd) }}
        />
      </head>
      <AppContextProvider>
        <body className={`${inter.className} antialiased`}>
          {children}
          <Toaster position="top-right" />
        </body>
      </AppContextProvider>
    </html>
  );
}