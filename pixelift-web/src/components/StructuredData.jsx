import { buildStructuredData, safeJsonLdStringify } from "@/lib/structuredData";

export default function StructuredData({
  content,
  canonicalPath,
  inLanguage,
  siteName,
  appStoreUrl,
  appRatingValue,
  appRatingBest,
  appRatingCount,
  appReviewCount,
  offerPrice,
  priceCurrency,
  id = "structured-data",
}) {
  const jsonLd = buildStructuredData({
    content,
    canonicalPath,
    inLanguage,
    siteName,
    appStoreUrl,
    appRatingValue,
    appRatingBest,
    appRatingCount,
    appReviewCount,
    offerPrice,
    priceCurrency,
  });

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
    />
  );
}
