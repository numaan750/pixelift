export const BRAND = "AI Soulmate Drawings";

const CTA_BY_CODE = {
  us: " Try it free today.",
  uk: " Try it free today.",
  de: " Jetzt kostenlos testen.",
  fr: " Essayez gratuitement.",
  ru: " Попробуйте бесплатно.",
  cn: " 立即免费试用。",
  br: " Experimente grátis.",
  jp: " 今すぐ無料で試す。",
  mx: " Pruébalo gratis.",
  vn: " Thử miễn phí ngay.",
  it: " Provalo gratis.",
  sa: " جرّبه مجانًا الآن.",
};

function normalizeWhitespace(text) {
  return String(text || "")
    .trim()
    .replace(/\s+/g, " ");
}

function truncateToMax(text, max) {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);

  // If there are spaces, avoid cutting mid-word.
  const lastSpace = slice.lastIndexOf(" ");
  const canUseWordBoundary = lastSpace > Math.floor(max * 0.6);
  const base = canUseWordBoundary ? slice.slice(0, lastSpace) : slice;

  // Add ellipsis if it fits.
  const ellipsis = "…";
  const trimmed = base.trim();
  if (trimmed.length + ellipsis.length <= max) return `${trimmed}${ellipsis}`;
  return trimmed.slice(0, max).trim();
}

/**
 * Enforces ~150–160 characters by appending a localized CTA if needed,
 * and truncating at max with a clean boundary.
 */
export function formatMetaDescription(text, code, { min = 150, max = 160 } = {}) {
  let desc = normalizeWhitespace(text);
  const cta = CTA_BY_CODE[code] || CTA_BY_CODE.us;

  if (!desc) desc = BRAND;

  if (desc.length < min) {
    const needsPunctuation = !/[.!؟。]$/.test(desc);
    desc = `${desc}${needsPunctuation ? "." : ""}${cta}`;
    desc = normalizeWhitespace(desc);
  }

  // Still short? Repeat CTA once (rare).
  if (desc.length < min) {
    desc = normalizeWhitespace(`${desc}${cta}`);
  }

  return truncateToMax(desc, max);
}

export const seo = {
  us: {
    title: `AI Soulmate Drawing Generator – Reveal Your Destiny | ${BRAND}`,
    description:
      "Create an AI soulmate drawing and future partner sketch in minutes with Soulmate Aura. Fast, fun, and private—get your romantic AI portrait today. Try it free.",
  },
  uk: {
    title: `AI Soulmate Drawing Generator – See Your Future Love | ${BRAND}`,
    description:
      "Create an AI soulmate drawing and future partner sketch in minutes with Soulmate Aura. Fast, fun, and private—get your romantic AI portrait today. Try it free.",
  },
  de: {
    title: `AI Soulmate Zeichnung – Dein Seelenpartner als Portrait | ${BRAND}`,
    description:
      "Erstelle eine AI‑Soulmate‑Zeichnung und ein romantisches KI‑Porträt in Minuten. Entdecke deine Skizze des zukünftigen Partners – schnell, sicher, kostenlos.",
  },
  fr: {
    title: `Dessin d'Âme Sœur IA – Révélez votre destin | ${BRAND}`,
    description:
      "Créez un dessin d'âme sœur IA et un portrait romantique en minutes. Découvrez votre partenaire — rapide, privé, prêt à partager. Essayez gratuitement.",
  },
  ru: {
    title: `ИИ‑рисунок родственной души — Узнайте свою судьбу | ${BRAND}`,
    description:
      "Создайте ИИ‑рисунок родственной души и романтический ИИ‑портрет за минуты. Получите эскиз будущего партнёра — быстро, удобно и приватно. Попробуйте бесплатно.",
  },
  cn: {
    title: `AI 灵魂伴侣绘画 — 发现你的命中注定 | ${BRAND}`,
    description:
      "使用 AI 灵魂伴侣绘画生成器，回答几个小问题，几分钟生成浪漫 AI 肖像与未来伴侣素描。" +
      "无需绘画基础，细节精致，支持多次生成、下载与设为壁纸。" +
      "生成后可保存到相册，随时回看，分享给朋友一起玩；也能随时重新生成并对比不同风格。" +
      "我们注重隐私与安全，让体验更安心。" +
      "现在就免费试用，看看你的命中注定到底是谁呢。",
  },
  br: {
    title: `Desenho de Alma Gêmea com IA – Seu futuro amor | ${BRAND}`,
    description:
      "Crie um desenho de alma gêmea com IA e um retrato romântico em minutos. Veja o esboço do futuro parceiro — rápido, privado e compartilhável. Experimente grátis.",
  },
  jp: {
    title: `AI ソウルメイト描画 – 運命の相手を見つける | ${BRAND}`,
    description:
      "AIソウルメイト描画で、未来のパートナーを数分でスケッチ。" +
      "簡単な入力だけでロマンチックなAIポートレートを作成し、仕上がりを保存・共有できます。" +
      "何度でも生成でき、壁紙にも最適。友達と結果を見比べて楽しめます。" +
      "データは管理しやすく、いつでも削除できます。安心して使えます。" +
      "運命をチェックしよう。今すぐ無料で試す。",
  },
  mx: {
    title: `Dibujo de Alma Gemela con IA – Conoce tu destino | ${BRAND}`,
    description:
      "Dibujo de alma gemela con IA en minutos: crea un retrato romántico y descubre el boceto de tu futura pareja. Rápido, privado y fácil. Pruébalo gratis.",
  },
  vn: {
    title: `Vẽ Linh Hồn Song Sinh AI – Khám phá định mệnh | ${BRAND}`,
    description:
      "Vẽ linh hồn song sinh bằng AI trong vài phút: tạo chân dung lãng mạn và phác họa người bạn đời tương lai. Nhanh, riêng tư, dễ dùng. Thử miễn phí ngay.",
  },
  it: {
    title: `Disegno Anima Gemella con IA – Scopri il destino | ${BRAND}`,
    description:
      "Disegno anima gemella con IA in pochi minuti: crea un ritratto romantico e scopri lo schizzo del tuo futuro partner. Veloce, privato e semplice. Provalo gratis.",
  },
  sa: {
    title: `رسمة الروح التوأم بالذكاء الاصطناعي — اكتشف قدرك | ${BRAND}`,
    description:
      "أنشئ رسمة الروح التوأم بالذكاء الاصطناعي خلال دقائق: أجب عن بضعة أسئلة واحصل على بورتريه رومانسي يبيّن ملامح شريكك المستقبلي بشكل خاص وآمن. جرّبه مجانًا الآن.",
  },
};
