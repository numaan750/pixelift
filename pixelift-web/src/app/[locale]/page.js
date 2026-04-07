import Component from "./component";
import { countries, hreflangLanguages } from "@/lib/countries";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import { seo, BRAND, formatMetaDescription } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { getCountryContent, normalizeCountry, COUNTRY_CODES } from "@/lib/countryContent";
import { altFromSrcOrAlt } from "@/lib/altText";

export function generateStaticParams() {
  return COUNTRY_CODES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const code = normalizeCountry(locale);
  const data = seo[code] || seo.us;
  const description = formatMetaDescription(data.description, code);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || SITE_URL;
  const content = getCountryContent(code);
  const ogImage = content?.hero?.image || "/home-images/See-What-Your-Soulmate-Looks-Like.webp";
  const ogAlt = altFromSrcOrAlt({ alt: content?.hero?.alt || data.title, src: ogImage, locale: code });
  const countryName = countries[code]?.name || "United States";
  // SEO safeguard: every locale route must self-canonicalize to its own path,
  // never to '/'. This prevents accidental duplicate-content canonicals.
  const canonicalPath = `/${code}`;
  const canonicalAbsolute = `${baseUrl}/${code}`;

  return {
    title: data.title,
    description,
    keywords: [
      "AI soulmate drawing",
      "AI soulmate drawings",
      "romantic AI portrait",
      "future partner sketch",
      `AI soulmate drawing ${countryName}`,
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
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalPath,
      languages: hreflangLanguages,
    },
    openGraph: {
      type: "website",
      url: canonicalAbsolute,
      siteName: BRAND,
      title: data.title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description,
      images: [
        {
          url: ogImage,
          alt: ogAlt,
        },
      ],
    },
  };
}

export default async function Page({ params }) {
  const { locale } = await params;

  const code = normalizeCountry(locale);
  const text = getCountryContent(code);
  const countryObj = countries[code] || countries.us;

  return (
    <>
      <StructuredData
        content={text}
        canonicalPath={`/${code}`}
        inLanguage={countryObj.lang}
        siteName="AI Soulmate Drawings"
        appStoreUrl="https://apps.apple.com/us/app/soulmate-art-ai-drawing/id6752238846"
        appRatingValue={4.7}
        appRatingCount={137}
        offerPrice={0}
        priceCurrency={countryObj.currency}
        id={`structured-data-${code}`}
      />
      <Navbar navLinks={text.navLinks} country={code} />
      <Component locale={code} />
      <Footer footer={text.footer} country={code} />
    </>
  );
}
