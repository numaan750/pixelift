import { absoluteUrl } from "@/lib/site";

function compactObject(value) {
  if (Array.isArray(value)) {
    return value
      .map(compactObject)
      .filter((v) => v !== undefined && v !== null && v !== "");
  }

  if (value && typeof value === "object") {
    const out = {};
    for (const [key, v] of Object.entries(value)) {
      const next = compactObject(v);
      if (next === undefined || next === null) continue;
      if (typeof next === "string" && next.trim() === "") continue;
      if (Array.isArray(next) && next.length === 0) continue;
      out[key] = next;
    }
    return out;
  }

  return value;
}

export function safeJsonLdStringify(data) {
  // Prevent closing the script tag in JSON-LD payload.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function getPageName(content) {
  const title = content?.hero?.title?.trim();
  const subTitle = content?.hero?.subTitle?.trim();
  if (title && subTitle) return `${title} ${subTitle}`;
  return title || subTitle || "AI Soulmate Drawings";
}

function getPageDescription(content) {
  return (
    content?.hero?.description?.trim() ||
    content?.magicalCore?.description?.trim() ||
    "AI-powered tool that creates romantic soulmate and couple portraits."
  );
}

function getVisibleFaqItems(content) {
  const items = content?.faqs?.faq;
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => ({
      question: item?.question?.trim(),
      answer: item?.answer?.trim(),
    }))
    .filter((qa) => qa.question && qa.answer);
}

function getVisibleHowToSteps(content) {
  const how = content?.magicHappens;
  if (!how) return [];

  const steps = [how?.step1, how?.step2, how?.step3, how?.step4]
    .map((step, idx) => {
      const name = step?.title?.trim();
      const text = step?.description?.trim();
      const image = step?.image;
      if (!name || !text) return null;
      return {
        position: idx + 1,
        name,
        text,
        image: image ? absoluteUrl(image) : undefined,
      };
    })
    .filter(Boolean);

  return steps;
}

export function buildStructuredData({
  content,
  canonicalPath,
  inLanguage,
  siteName = "AI Soulmate Drawings",
  appStoreUrl,
  appRatingValue,
  appRatingCount,
  appReviewCount,
  appRatingBest = 5,
  offerPrice,
  priceCurrency,
}) {
  const pageUrl = absoluteUrl(canonicalPath);
  const name = getPageName(content);
  const description = getPageDescription(content);

  const heroImage = content?.hero?.image ? absoluteUrl(content.hero.image) : undefined;
  const images = heroImage ? [heroImage] : undefined;

  const faqItems = getVisibleFaqItems(content);
  const howToSteps = getVisibleHowToSteps(content);
  const howToTitle = content?.magicHappens?.title?.trim();
  const howToDescription = content?.magicHappens?.description?.trim();

  const graph = [];

  const ratingCountNum =
    typeof appRatingCount === "number" && Number.isFinite(appRatingCount)
      ? appRatingCount
      : undefined;
  const reviewCountNum =
    typeof appReviewCount === "number" && Number.isFinite(appReviewCount)
      ? appReviewCount
      : undefined;

  // Google Rich Results requires ratingCount or reviewCount for review snippets.
  // We only include AggregateRating when the count is actually available/visible.
  const aggregateRating =
    typeof appRatingValue === "number" &&
    Number.isFinite(appRatingValue) &&
    (ratingCountNum || reviewCountNum)
      ? {
          "@type": "AggregateRating",
          ratingValue: appRatingValue,
          bestRating: appRatingBest,
          ratingCount: ratingCountNum,
          reviewCount: reviewCountNum,
        }
      : undefined;

  const hasNonZeroPrice =
    (typeof offerPrice === "number" && Number.isFinite(offerPrice) && offerPrice !== 0) ||
    (typeof offerPrice === "string" && offerPrice.trim() !== "" && offerPrice.trim() !== "0");

  const offers =
    hasNonZeroPrice &&
    priceCurrency
      ? {
          "@type": "Offer",
          price: offerPrice,
          priceCurrency,
          availability: "https://schema.org/InStock",
          url: pageUrl,
        }
      : undefined;

  // SoftwareApplication schema (minimal + only based on visible content)
  graph.push(
    compactObject({
      "@type": "SoftwareApplication",
      "@id": `${pageUrl}#softwareapplication`,
      name,
      description,
      url: pageUrl,
      image: images,
      inLanguage,
      operatingSystem: "iOS",
      installUrl: appStoreUrl,
      aggregateRating,
      offers,
      applicationCategory: "AIApplication",
    })
  );

  // Product schema (minimal + based on visible content)
  graph.push(
    compactObject({
      "@type": "Product",
      "@id": `${pageUrl}#product`,
      name,
      description,
      url: pageUrl,
      image: images,
      brand: {
        "@type": "Brand",
        name: siteName,
      },
      aggregateRating,
      offers,
    })
  );

  if (faqItems.length > 0) {
    graph.push(
      compactObject({
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        url: pageUrl,
        inLanguage,
        mainEntity: faqItems.map((qa) => ({
          "@type": "Question",
          name: qa.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: qa.answer,
          },
        })),
      })
    );
  }

  if (howToSteps.length > 0 && howToTitle) {
    graph.push(
      compactObject({
        "@type": "HowTo",
        "@id": `${pageUrl}#howto`,
        name: howToTitle,
        description: howToDescription,
        inLanguage,
        step: howToSteps.map((s) => ({
          "@type": "HowToStep",
          position: s.position,
          name: s.name,
          text: s.text,
          image: s.image,
        })),
      })
    );
  }

  return {
    "@context": "https://schema.org",
    "@graph": compactObject(graph),
  };
}
