import { countries } from "./countries";
import { us, ru, de, uk, cn, br, jp, mx, fr, vn, it, sa } from "@/app/constants";
import { SUPPORTED_LOCALES } from "./locales";

// Keep generated/valid locale routes constrained to a fixed allowlist.
// This is used by SSG params and by locale normalization.
export const COUNTRY_CODES = SUPPORTED_LOCALES;

export const COUNTRY_CONTENT = {
  us,
  ru,
  de,
  uk,
  cn,
  br,
  jp,
  mx,
  fr,
  vn,
  it,
  sa,
};

export function normalizeCountry(country) {
  const code = String(country || "").toLowerCase();
  return COUNTRY_CODES.includes(code) ? code : "us";
}

function isObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function pickFirstDefined(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function normalizeTestimonials(testimonial, fallbackTestimonial) {
  const base = isObject(fallbackTestimonial) ? fallbackTestimonial : {};
  const raw = isObject(testimonial) ? testimonial : {};

  let testimonials =
    Array.isArray(raw.testimonials)
      ? raw.testimonials
      : Array.isArray(raw.reviews)
        ? raw.reviews.map((r) => ({ text: r?.review, name: r?.name }))
        : Array.isArray(base.testimonials)
          ? base.testimonials
          : [];

  // Some locales only ship 3 reviews; keep structure consistent with US (6 cards).
  const targetCount = 6;
  const baseItems = Array.isArray(base.testimonials) ? base.testimonials : [];
  if (testimonials.length < targetCount && baseItems.length) {
    const padded = [...testimonials];
    for (const item of baseItems) {
      if (padded.length >= targetCount) break;
      padded.push(item);
    }
    testimonials = padded;
  }

  if (testimonials.length > targetCount) {
    testimonials = testimonials.slice(0, targetCount);
  }

  return {
    title: pickFirstDefined(raw.title, base.title),
    description: pickFirstDefined(raw.description, base.description),
    testimonials,
  };
}

function normalizeFaqs(faqs, fallbackFaqs) {
  const base = isObject(fallbackFaqs) ? fallbackFaqs : {};

  if (Array.isArray(faqs)) {
    return {
      title: pickFirstDefined(base.title, "Frequent Asked Questions"),
      faq: faqs,
      img: pickFirstDefined(base.img, "/home-images/FAQ-Img.webp"),
      alt: pickFirstDefined(base.alt, "FAQ-Img.webp"),
    };
  }

  const raw = isObject(faqs) ? faqs : {};
  return {
    title: pickFirstDefined(raw.title, base.title, "Frequent Asked Questions"),
    faq: Array.isArray(raw.faq) ? raw.faq : Array.isArray(base.faq) ? base.faq : [],
    img: pickFirstDefined(raw.img, base.img, "/home-images/FAQ-Img.webp"),
    alt: pickFirstDefined(raw.alt, base.alt, "FAQ-Img.webp"),
  };
}

function normalizeContact(contact, fallbackContact) {
  const base = isObject(fallbackContact) ? fallbackContact : {};
  const raw = isObject(contact) ? contact : {};

  const submitLabel = pickFirstDefined(raw?.form?.submit, raw.button, base.button, "Send Message");

  return {
    title: pickFirstDefined(raw.title, base.title, "Contact Us"),
    description: pickFirstDefined(raw.description, base.description),
    email: pickFirstDefined(raw.email, base.email),
    address: pickFirstDefined(raw.address, base.address),
    phone: pickFirstDefined(raw.phone, base.phone),
    button: submitLabel,
    loading: pickFirstDefined(raw.loading, base.loading, "Sending..."),
    form: isObject(raw.form) ? raw.form : isObject(base.form) ? base.form : undefined,
  };
}

function normalizeFooter(footer, fallbackFooter) {
  const base = isObject(fallbackFooter) ? fallbackFooter : {};
  const raw = isObject(footer) ? footer : {};

  const links = Array.isArray(raw.links) ? raw.links : [];
  const privacyLabel =
    pickFirstDefined(
      raw.page1,
      links.find((l) => /privacy|privac/i.test(l?.label ?? ""))?.label,
      base.page1,
      "Privacy Policy"
    );
  const termsLabel =
    pickFirstDefined(
      raw.page2,
      links.find((l) => /terms|condition/i.test(l?.label ?? ""))?.label,
      base.page2,
      "Terms & Conditions"
    );

  return {
    title: pickFirstDefined(raw.title, base.title, "Soulmate Art"),
    page1: privacyLabel,
    page2: termsLabel,
    text: pickFirstDefined(raw.text, raw.copyright, raw.description, base.text),
  };
}

function normalizeSoulmateArt(soulmateArt, fallbackSoulmateArt) {
  const base = isObject(fallbackSoulmateArt) ? fallbackSoulmateArt : {};
  const raw = isObject(soulmateArt) ? soulmateArt : {};

  const fallbackImg = pickFirstDefined(base.img, "/home-images/Discover-Everything-in-Soulmate-Art.webp");
  const imgFromFeatures = raw?.features?.[0]?.image;
  const altFromFeatures = raw?.features?.[0]?.alt;

  return {
    title: pickFirstDefined(raw.title, base.title),
    description: pickFirstDefined(raw.description, base.description),
    text1: pickFirstDefined(raw.text1, base.text1, "User Satisfaction"),
    text2: pickFirstDefined(raw.text2, base.text2, "Rating out of 5"),
    img: pickFirstDefined(raw.img, imgFromFeatures, fallbackImg),
    alt: pickFirstDefined(raw.alt, altFromFeatures, base.alt),
    ratingCount: pickFirstDefined(raw.ratingCount, base.ratingCount),
  };
}

function normalizeAiArt(aiArt, fallbackAiArt) {
  const base = isObject(fallbackAiArt) ? fallbackAiArt : {};
  const raw = isObject(aiArt) ? aiArt : {};

  const normalized = {
    title: pickFirstDefined(raw.title, base.title),
    description: pickFirstDefined(raw.description, base.description),
  };

  // Keep whatever the locale provides, but also ensure US-style img1..img10 exist
  // when a locale only ships `features`.
  const features = Array.isArray(raw.features) ? raw.features : undefined;
  if (features) normalized.features = features;

  const hasUsStyleImages =
    raw.img1?.url ||
    raw.img2?.url ||
    raw.img3?.url ||
    raw.img4?.url ||
    raw.img5?.url ||
    raw.img6?.url ||
    raw.img7?.url ||
    raw.img8?.url ||
    raw.img9?.url ||
    raw.img10?.url;

  const looksLikeFilenameAlt = (value) =>
    typeof value === "string" && /\.(png|webp|jpe?g|svg|gif)\b/i.test(value);

  const applyAltByImage = (merged) => {
    const altByImage = isObject(raw.altByImage) ? raw.altByImage : undefined;
    if (!altByImage) return merged;

    const updated = { ...merged };
    for (let i = 1; i <= 10; i += 1) {
      const key = `img${i}`;
      const img = updated[key];
      const nextAlt = altByImage[key];
      if (img?.url && typeof nextAlt === "string" && nextAlt.trim()) {
        updated[key] = { ...img, alt: nextAlt };
      }
    }
    return updated;
  };

  if (hasUsStyleImages) {
    const merged = { ...normalized, ...raw };
    // If locale inherited US gallery images, their alts are often filenames in English.
    // Use the localized section title as a safer language-appropriate alt.
    if (raw.title && raw.title !== base.title) {
      for (let i = 1; i <= 10; i += 1) {
        const key = `img${i}`;
        const img = merged[key];
        if (img?.url && (img?.alt == null || looksLikeFilenameAlt(img.alt))) {
          merged[key] = { ...img, alt: raw.title };
        }
      }
    }
    return applyAltByImage(merged);
  }

  if (features) {
    const mapped = {};
    for (let i = 0; i < Math.min(features.length, 10); i += 1) {
      const item = features[i];
      mapped[`img${i + 1}`] = { url: item?.image, alt: item?.alt };
    }
    return applyAltByImage({ ...normalized, ...mapped });
  }

  return applyAltByImage({ ...normalized, ...base });
}

function normalizeMagicalCore(magicalCore, fallbackMagicalCore) {
  const base = isObject(fallbackMagicalCore) ? fallbackMagicalCore : {};
  const raw = isObject(magicalCore) ? magicalCore : {};

  const rawFeatures = Array.isArray(raw.features) ? raw.features : undefined;
  const baseFeatures = Array.isArray(base.features) ? base.features : [];

  const features = (rawFeatures ?? baseFeatures).map((f) => ({
    Imge: pickFirstDefined(f?.Imge, f?.image),
    alt: f?.alt,
  }));

  return {
    title: pickFirstDefined(raw.title, base.title),
    description: pickFirstDefined(raw.description, base.description),
    features,
  };
}

function normalizeMagicHappens(magicHappens, fallbackMagicHappens) {
  const base = isObject(fallbackMagicHappens) ? fallbackMagicHappens : {};
  const raw = isObject(magicHappens) ? magicHappens : {};

  return {
    title: pickFirstDefined(raw.title, base.title),
    description: pickFirstDefined(raw.description, base.description),
    step1: { ...base.step1, ...raw.step1 },
    step2: { ...base.step2, ...raw.step2 },
    step3: { ...base.step3, ...raw.step3 },
    // Force step-4 image to match US across all countries.
    step4: {
      ...base.step4,
      ...raw.step4,
      image: base?.step4?.image,
      alt: base?.step4?.alt,
    },
  };
}

function normalizeHero(hero, fallbackHero) {
  const base = isObject(fallbackHero) ? fallbackHero : {};
  const raw = isObject(hero) ? hero : {};
  return {
    ...base,
    ...raw,
    image: pickFirstDefined(raw.image, base.image),
    alt: pickFirstDefined(raw.alt, base.alt),
  };
}

function normalizeCountryContent(rawContent, fallbackContent) {
  const base = isObject(fallbackContent) ? fallbackContent : {};
  const raw = isObject(rawContent) ? rawContent : {};

  return {
    navLinks: Array.isArray(raw.navLinks) ? raw.navLinks : base.navLinks,
    hero: normalizeHero(raw.hero, base.hero),
    magicalCore: normalizeMagicalCore(raw.magicalCore, base.magicalCore),
    magicHappens: normalizeMagicHappens(raw.magicHappens, base.magicHappens),
    aiArt: normalizeAiArt(raw.aiArt, base.aiArt),
    soulmateArt: normalizeSoulmateArt(raw.soulmateArt, base.soulmateArt),
    testimonial: normalizeTestimonials(raw.testimonial, base.testimonial),
    faqs: normalizeFaqs(raw.faqs, base.faqs),
    contact: normalizeContact(raw.contact, base.contact),
    footer: normalizeFooter(raw.footer, base.footer),
  };
}

export function getCountryContent(country) {
  const code = normalizeCountry(country);
  const raw = COUNTRY_CONTENT[code] || us;
  return normalizeCountryContent(raw, us);
}
