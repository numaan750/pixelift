// components/CountrySchema.jsx
export default function CountrySchema({ country }) {
  const defaultC = {
    name: "United States",
    title: "AI Soulmate Drawings",
    description: "AI-powered tool that creates romantic soulmate and couple portraits from photos.",
    currency: "USD",
    lang: "en-US",
    faq: [
      {
        q: "Is AI Soulmate Drawing free?",
        a: "Yes, you can generate one AI soulmate drawing for free.",
      },
      {
        q: "How long does it take to generate?",
        a: "It usually takes less than 30 seconds.",
      },
      {
        q: "Is my photo safe?",
        a: "Yes, your photos are processed securely and are not shared.",
      },
    ],
  };

  const c = { ...defaultC, ...(country || {}) };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: c.title,
    applicationCategory: "AIApplication",
    operatingSystem: "Web",
    description: c.description,
    inLanguage: c.lang,
    url: typeof window !== "undefined" ? window.location.href : undefined,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: c.currency,
      availability: "https://schema.org/InStock",
    },
    areaServed: {
      "@type": "Country",
      name: c.name,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: c.lang,
    mainEntity: c.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const combined = [softwareSchema, faqSchema];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(combined, null, 2) }}
    />
  );
}