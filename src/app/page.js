import { hreflangLanguages } from "@/lib/countries";
import { seo, formatMetaDescription } from "@/lib/seo";
import { getCountryContent } from "@/lib/countryContent";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import Component from "./[locale]/component";

export const metadata = {
  title: seo.us.title,
  description: formatMetaDescription(seo.us.description, "us"),
  alternates: {
    // Root is the x-default canonical. Locale pages canonically point to `/<locale>`.
    canonical: "/",
    languages: hreflangLanguages,
  },
};

export default function Page() {
  // Default (x-default) homepage content.
  const code = "us";
  const text = getCountryContent(code);

  return (
    <>
      <StructuredData
        content={text}
        canonicalPath="/"
        inLanguage="en-US"
        siteName="Picelift AI Photo Enhancer"
        appStoreUrl="https://apps.apple.com/us/app/pixelift-ai-photo-enhancer/id6748871047"
        appRatingValue={4.7}
        appRatingCount={137}
        offerPrice={0}
        priceCurrency="USD"
        id="structured-data-root"
      />
      <Navbar navLinks={text.navLinks} country={code} />
      <Component locale={code} />
      <Footer footer={text.footer} country={code} />
    </>
  );
}
