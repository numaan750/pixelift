export const BLOG_POSTS = [
  {
    slug: "ai-soulmate-drawing-generator",
    title: "AI Soulmate Drawing Generator: What It Is + How To Get Better Results",
    description:
      "Learn what the AI Soulmate Drawing Generator does, what you’ll receive, and simple tips to get better, more satisfying results.",
    excerpt:
      "A quick guide to how the AI Soulmate Drawing Generator works, what you’ll get, and how to get the most accurate, satisfying results.",
    date: "2026-01-01",
    relatedSlugs: [
      "best-prompts-for-ai-soulmate-portrait",
      "soulmate-sketch-ai-tips",
    ],
  },
  {
    slug: "soulmate-sketch-ai-tips",
    title: "Soulmate Sketch AI: 9 Practical Tips for Better Results",
    description:
      "Improve your soulmate sketch AI results with simple, practical tips—from prompt clarity to style consistency and iteration.",
    excerpt:
      "Make your soulmate sketch AI results more consistent and satisfying with nine practical tips you can apply right away.",
    date: "2026-01-02",
    relatedSlugs: [
      "best-prompts-for-ai-soulmate-portrait",
      "future-partner-drawing-ai",
    ],
  },
  {
    slug: "future-partner-drawing-ai",
    title: "Future Partner Drawing (AI): What You’ll Get + How To Guide the Style",
    description:
      "What a future partner drawing from AI typically looks like and how to guide the style, vibe, and details without overprompting.",
    excerpt:
      "A clear explanation of what you receive from a future partner AI drawing—and how to guide the style without overdoing it.",
    date: "2026-01-02",
    relatedSlugs: [
      "soulmate-sketch-ai-tips",
      "how-accurate-are-ai-soulmate-drawings",
    ],
  },
  {
    slug: "how-accurate-are-ai-soulmate-drawings",
    title: "How Accurate Are AI Soulmate Drawings? A Realistic Explanation",
    description:
      "A realistic look at what “accuracy” means for AI soulmate drawings, what affects results, and how to interpret them.",
    excerpt:
      "A realistic view of AI soulmate drawing “accuracy”, what affects results, and how to interpret them in a healthy way.",
    date: "2026-01-02",
    relatedSlugs: [
      "ai-soulmate-drawing-generator",
      "ai-soulmate-drawing-privacy",
    ],
  },
  {
    slug: "best-prompts-for-ai-soulmate-portrait",
    title: "Best Prompts for an AI Soulmate Portrait (With Examples)",
    description:
      "Example prompt patterns for an AI soulmate portrait: style, mood, lighting, and a simple structure that stays consistent.",
    excerpt:
      "Steal these prompt patterns for style, mood, and lighting to get a better AI soulmate portrait without guesswork.",
    date: "2026-01-02",
    relatedSlugs: [
      "soulmate-sketch-ai-tips",
      "ai-soulmate-drawing-generator",
    ],
  },
  {
    slug: "ai-soulmate-drawing-privacy",
    title: "AI Soulmate Drawing Privacy: What to Share (and What to Avoid)",
    description:
      "A privacy-first checklist for AI soulmate drawings: what inputs to share, what not to share, and how to stay comfortable.",
    excerpt:
      "A practical privacy checklist for AI soulmate drawings—what to share, what to avoid, and how to stay comfortable.",
    date: "2026-01-02",
    relatedSlugs: [
      "how-accurate-are-ai-soulmate-drawings",
      "ai-soulmate-drawing-generator",
    ],
  },
];

export function getPostBySlug(slug) {
  return BLOG_POSTS.find((post) => post.slug === slug) || null;
}
