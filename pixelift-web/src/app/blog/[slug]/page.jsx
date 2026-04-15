import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { us } from "@/app/constants/us";
import { absoluteUrl } from "@/lib/site";
import { safeJsonLdStringify } from "@/lib/structuredData";
import { BLOG_POSTS, getPostBySlug } from "@/lib/blogPosts";
import { getBlogPostBySlugFromDb } from "@/lib/blogDb";
import { getAllBlogPostsFromDb } from "@/lib/blogDb";
import SafeHtml from "@/components/SafeHtml";
import TocClient from "@/components/TocClient";

function resolveImageUrl(postImageUrl) {
  if (!postImageUrl) return null;
  if (
    postImageUrl.startsWith("http://") ||
    postImageUrl.startsWith("https://")
  ) {
    return postImageUrl;
  }
  if (postImageUrl.startsWith("/")) {
    return absoluteUrl(postImageUrl);
  }
  return postImageUrl;
}

function stripHtmlTags(html = "") {
  return String(html)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyHeading(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/&[a-z]+;/g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function addHeadingIdsAndExtractToc(html = "") {
  const toc = [];
  const usedIds = new Map();

  const withIds = String(html).replace(
    /<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi,
    (match, tag, attrs, inner) => {
      const level = tag.toLowerCase() === "h2" ? 2 : 3;
      const hasId = /\sid\s*=\s*['"][^'"]+['"]/i.test(attrs);
      const existingId = hasId
        ? (attrs.match(/\sid\s*=\s*['"]([^'"]+)['"]/i) || [])[1]
        : "";

      const text = stripHtmlTags(inner);
      if (!text) return match;

      let id =
        existingId || slugifyHeading(text) || `section-${toc.length + 1}`;
      const seenCount = usedIds.get(id) || 0;
      usedIds.set(id, seenCount + 1);
      if (!existingId && seenCount > 0) {
        id = `${id}-${seenCount + 1}`;
      }

      toc.push({ id, level, text });

      if (existingId) return match;

      const normalizedAttrs = attrs || "";
      return `<${tag}${normalizedAttrs} id="${id}">${inner}</${tag}>`;
    },
  );

  return { html: withIds, toc };
}

function estimateReadingTimeMinutes(html = "") {
  const text = stripHtmlTags(html);
  const words = text ? text.split(" ").filter(Boolean).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return minutes;
}

function sortPostsByDateDesc(posts) {
  return [...posts].sort((a, b) => {
    const aTime = a?.date ? new Date(a.date).getTime() : 0;
    const bTime = b?.date ? new Date(b.date).getTime() : 0;
    return bTime - aTime;
  });
}

function SidebarCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-[#3B7FFF]/10 to-[#2CAA78]/10 p-5">
      <h2 className="text-[16px] font-semibold text-white">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function RecentPosts({ posts }) {
  if (!posts?.length) return null;

  return (
    <ul className="space-y-3">
      {posts.map((p) => (
        <li key={p.slug}>
          <Link
            href={`/blog/${p.slug}`}
            className="text-sm text-white hover:text-blue-400 transition-colors"
          >
            {p.title}
          </Link>
          {p.date ? (
            <div className="mt-1 text-xs text-gray-400">{p.date}</div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function PostLinksFooter() {
  return (
    <div className="mt-10 rounded-2xl border border-zinc-800 bg-gradient-to-r from-[#3B7FFF]/10 to-[#2CAA78]/10 p-6">
      <h2 className="text-[18px] sm:text-[20px] font-semibold text-white">
        Next steps
      </h2>
      <p className="mt-2 text-gray-300">
        Start on the{" "}
        <Link
          href="/"
          className="text-[#AABFFF] hover:text-blue-400 transition-colors underline"
        >
          homepage
        </Link>
        , or jump to the main CTA via{" "}
        <Link
          href="/#contact"
          className="text-[#AABFFF] hover:text-blue-400 transition-colors underline"
        >
          contact
        </Link>
        . You can also explore localized pages like{" "}
        <Link
          href="/uk"
          className="text-[#AABFFF] hover:text-blue-400 transition-colors underline"
        >
          United Kingdom
        </Link>{" "}
        or{" "}
        <Link
          href="/de"
          className="text-[#AABFFF] hover:text-blue-400 transition-colors underline"
        >
          Germany
        </Link>
        .
      </p>
    </div>
  );
}

function RelatedPosts({ currentSlug }) {
  const current = getPostBySlug(currentSlug);
  if (!current?.relatedSlugs?.length) return null;

  const related = current.relatedSlugs
    .map((slug) => getPostBySlug(slug))
    .filter(Boolean)
    .slice(0, 2);

  if (!related.length) return null;

  return (
    <div className="mt-10 rounded-2xl border border-zinc-800 bg-gradient-to-r from-[#3B7FFF]/10 to-[#2CAA78]/10 p-6">
      <h2 className="text-[18px] sm:text-[20px] font-semibold text-white">
        Related posts
      </h2>
      <ul className="mt-3 space-y-2">
        {related.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="text-[#AABFFF] hover:text-blue-400 transition-colors underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PostBody({ slug }) {
  switch (slug) {
    case "ai-soulmate-drawing-generator":
      return (
        <>
          <p>
            If you’re curious what your future partner might look like, the AI
            Soulmate Drawing Generator is a simple way to turn a few personal
            details into a romantic AI portrait. The goal isn’t to replace real
            relationships it’s to create a fun, shareable sketch-style result
            that feels personal and surprisingly specific.
          </p>

          <h2 className="text-[20px] sm:text-[24px] font-semibold text-white">
            What the tool does
          </h2>
          <p>
            The generator creates an AI-powered soulmate drawing (a portrait or
            sketch) based on the inputs you provide. After you submit the
            details, you’ll get an image you can download and keep.
          </p>

          <h2 className="text-[20px] sm:text-[24px] font-semibold text-white">
            How to get better results
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <span className="font-medium text-white">Be consistent:</span> Use
              the same vibe/style description each time if you want to compare
              results.
            </li>
            <li>
              <span className="font-medium text-white">Describe clearly:</span>{" "}
              A short, concrete description (e.g., “warm smile, soft lighting,
              cinematic”) usually works better than many vague adjectives.
            </li>
            <li>
              <span className="font-medium text-white">Try 2-3 runs:</span>{" "}
              Generate a few versions and pick the one that feels most “right”.
            </li>
          </ol>

          <h2 className="text-[20px] sm:text-[24px] font-semibold text-white">
            Where to try it
          </h2>
          <p>
            Ready to try it? Start on the{" "}
            <Link
              href="/"
              className="text-[#AABFFF] hover:text-blue-400 transition-colors underline"
            >
              AI Soulmate Drawings homepage
            </Link>{" "}
            and, if you have questions, reach out via{" "}
            <Link
              href="/#contact"
              className="text-[#AABFFF] hover:text-blue-400 transition-colors underline"
            >
              contact
            </Link>
            .
          </p>

          <p className="text-gray-300">
            Want more guides like this? Visit the{" "}
            <Link
              href="/blog"
              className="text-[#AABFFF] hover:text-blue-400 transition-colors underline"
            >
              blog
            </Link>{" "}
            for updates and tips.
          </p>
        </>
      );

    case "soulmate-sketch-ai-tips":
      return (
        <>
          <p>
            “Soulmate sketch AI” results improve the most when you keep your
            inputs consistent and your style direction simple. Below are
            practical changes that usually make outputs cleaner, more
            believable, and more “you”.
          </p>

          <h2 className="text-[20px] sm:text-[24px] font-semibold text-white">
            9 tips that actually help
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <span className="font-medium text-white">Pick one style:</span>{" "}
              sketch, realistic, cinematic, or anime don’t mix.
            </li>
            <li>
              <span className="font-medium text-white">Use 1 mood:</span> warm,
              soft, dramatic, playful.
            </li>
            <li>
              <span className="font-medium text-white">
                Keep details tight:
              </span>{" "}
              3-5 strong descriptors beat 20 vague ones.
            </li>
            <li>
              <span className="font-medium text-white">
                Repeat the structure:
              </span>{" "}
              same order of traits each run.
            </li>
            <li>
              <span className="font-medium text-white">
                Avoid contradictions:
              </span>{" "}
              don’t ask for “sharp” and “soft focus” together.
            </li>
            <li>
              <span className="font-medium text-white">
                Try 2-3 iterations:
              </span>{" "}
              pick the best and refine.
            </li>
            <li>
              <span className="font-medium text-white">
                Prefer simple lighting:
              </span>{" "}
              “soft daylight” often looks best.
            </li>
            <li>
              <span className="font-medium text-white">Don’t overfit:</span>{" "}
              it’s a romantic sketch, not a biometric match.
            </li>
            <li>
              <span className="font-medium text-white">
                Save your favorites:
              </span>{" "}
              build a personal style baseline.
            </li>
          </ol>

          <p>
            If you’re browsing from the UK, try the localized experience on{" "}
            <Link
              href="/uk"
              className="text-[#AABFFF] hover:text-blue-400 transition-colors underline"
            >
              /uk
            </Link>
            .
          </p>
        </>
      );

    case "future-partner-drawing-ai":
      return (
        <>
          <p>
            A “future partner drawing” made with AI is usually a portrait-style
            image with a sketch vibe. The best results happen when you guide the
            style and mood, then let the AI handle the details.
          </p>

          <h2 className="text-[20px] sm:text-[24px] font-semibold text-white">
            What you typically receive
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>A single portrait/sketch you can download.</li>
            <li>A consistent “look” when you reuse the same style inputs.</li>
            <li>Better results after a couple of attempts.</li>
          </ul>

          <h2 className="text-[20px] sm:text-[24px] font-semibold text-white">
            How to guide the style (without overprompting)
          </h2>
          <p>
            Keep it to: <span className="text-white">style</span>{" "}
            (sketch/realistic), <span className="text-white">lighting</span>{" "}
            (soft daylight), and <span className="text-white">mood</span>{" "}
            (warm/romantic).
          </p>

          <p>
            If you want a localized landing page, try{" "}
            <Link
              href="/de"
              className="text-[#AABFFF] hover:text-blue-400 transition-colors underline"
            >
              /de
            </Link>{" "}
            for Germany.
          </p>
        </>
      );

    case "how-accurate-are-ai-soulmate-drawings":
      return (
        <>
          <p>
            “Accuracy” for AI soulmate drawings usually means the result feels
            emotionally right (vibe, style, personality cues), not that it
            predicts a real person’s exact face.
          </p>

          <h2 className="text-[20px] sm:text-[24px] font-semibold text-white">
            What affects results most
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>How consistent your style inputs are across runs.</li>
            <li>Whether your prompts are clear and non-contradictory.</li>
            <li>How you interpret the output (vibe vs literal).</li>
          </ul>

          <p>
            The healthiest way to use it is as a fun, romantic conceptthen use
            the output as inspiration.
          </p>

          <p>
            Want to try it right away? Start here:{" "}
            <Link
              href="/"
              className="text-[#AABFFF] hover:text-blue-400 transition-colors underline"
            >
              /
            </Link>
            .
          </p>
        </>
      );

    case "best-prompts-for-ai-soulmate-portrait":
      return (
        <>
          <p>
            Prompts work best when you use a simple structure. Here are patterns
            you can reuse to get a more consistent AI soulmate portrait.
          </p>

          <h2 className="text-[20px] sm:text-[24px] font-semibold text-white">
            Prompt structure (copy/paste)
          </h2>
          <p className="text-gray-300">Style + Lighting + Mood + 3 Traits</p>

          <h2 className="text-[20px] sm:text-[24px] font-semibold text-white">
            Example prompts
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              “pencil sketch portrait, soft daylight, warm romantic mood, gentle
              smile, kind eyes, natural look”
            </li>
            <li>
              “cinematic portrait, golden hour lighting, calm confident mood,
              subtle freckles, wavy hair, elegant style”
            </li>
          </ul>

          <p>
            For localized pages, you can explore options like{" "}
            <Link
              href="/fr"
              className="text-[#AABFFF] hover:text-blue-400 transition-colors underline"
            >
              /fr
            </Link>{" "}
            or{" "}
            <Link
              href="/mx"
              className="text-[#AABFFF] hover:text-blue-400 transition-colors underline"
            >
              /mx
            </Link>
            .
          </p>
        </>
      );

    case "ai-soulmate-drawing-privacy":
      return (
        <>
          <p>
            If you want to enjoy AI soulmate drawings while staying comfortable,
            a simple privacy checklist goes a long way.
          </p>

          <h2 className="text-[20px] sm:text-[24px] font-semibold text-white">
            What to share
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Style preferences (sketch vs realistic)</li>
            <li>General vibe and mood</li>
            <li>Non-sensitive traits (hair style, lighting, aesthetic)</li>
          </ul>

          <h2 className="text-[20px] sm:text-[24px] font-semibold text-white">
            What to avoid
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Full legal names</li>
            <li>Exact addresses, IDs, banking details</li>
            <li>Anything you wouldn’t want stored in a screenshot</li>
          </ul>

          <p>
            Questions about privacy or support? Use the contact section here:{" "}
            <Link
              href="/#contact"
              className="text-[#AABFFF] hover:text-blue-400 transition-colors underline"
            >
              /#contact
            </Link>
            .
          </p>
        </>
      );

    default:
      return null;
  }
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = true;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = (await getBlogPostBySlugFromDb(slug)) || getPostBySlug(slug);
  if (!post) return {};

  const canonicalPath = `/blog/${post.slug}`;
  const url = absoluteUrl(canonicalPath);
  const ogImage =
    resolveImageUrl(post.image_url) ||
    absoluteUrl("/home-images/See-What-Your-Soulmate-Looks-Like.webp");

  return {
    title: `${post.title} - AI Soulmate Drawings`,
    description: post.description,
    alternates: { canonical: canonicalPath },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      images: [{ url: ogImage }],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const dbPost = await getBlogPostBySlugFromDb(slug);
  const post = dbPost || getPostBySlug(slug);
  if (!post) return notFound();

  const dbPosts = await getAllBlogPostsFromDb({ limit: 20 });
  const allPosts = dbPosts?.length ? dbPosts : BLOG_POSTS;
  const recentPosts = sortPostsByDateDesc(allPosts)
    .filter((p) => p.slug !== slug)
    .slice(0, 6);

  const canonicalPath = `/blog/${post.slug}`;
  const url = absoluteUrl(canonicalPath);
  const imageUrl =
    resolveImageUrl(post.image_url) ||
    absoluteUrl("/home-images/See-What-Your-Soulmate-Looks-Like.webp");
  const publisherLogo = absoluteUrl("/icon.png");

  const hasDbHtml = Boolean(dbPost?.content_html);
  const processed = hasDbHtml
    ? addHeadingIdsAndExtractToc(dbPost.content_html)
    : { html: "", toc: [] };
  const readingTimeMinutes = hasDbHtml
    ? estimateReadingTimeMinutes(dbPost.content_html)
    : null;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#blogposting`,
    headline: post.title,
    description: post.description,
    url,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Organization",
      name: "AI Soulmate Drawings",
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: "AI Soulmate Drawings",
      logo: {
        "@type": "ImageObject",
        url: publisherLogo,
      },
    },
    image: [imageUrl],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: absoluteUrl("/blog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(breadcrumbJsonLd),
        }}
      />
      <Navbar navLinks={us.navLinks} country="us" />
      <main className="bg-[#12171B] text-white">
        <article className="mycontainer py-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <header className="max-w-none">
                <p className="text-sm text-gray-400">
                  {post.date}
                  {readingTimeMinutes ? (
                    <span className="text-gray-500">
                      {" "}
                      · {readingTimeMinutes} min read
                    </span>
                  ) : null}
                </p>
                <h1 className="mt-2 text-[28px] sm:text-[36px] md:text-[44px] font-bold">
                  {post.title}
                </h1>
                <p className="mt-4 text-[16px] sm:text-[18px] text-gray-300">
                  {post.description}
                </p>

                {Array.isArray(post.tags) && post.tags.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {post.tags.slice(0, 8).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1 text-xs text-gray-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}

                {imageUrl ? (
                  <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800">
                    <img
                      src={imageUrl}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full object-cover"
                    />
                  </div>
                ) : null}
              </header>

              <section className="mt-8 max-w-none space-y-6 text-white">
                {hasDbHtml ? (
                  <SafeHtml html={processed.html} className="blog-content" />
                ) : post.content_html ? (
                  <SafeHtml html={post.content_html} className="blog-content" />
                ) : (
                  <PostBody slug={slug} />
                )}

                <RelatedPosts currentSlug={slug} />
                <PostLinksFooter />
              </section>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <SidebarCard title="On this page">
                <TocClient items={processed.toc} />
              </SidebarCard>
              <SidebarCard title="Recent posts">
                <RecentPosts posts={recentPosts} />
              </SidebarCard>
            </aside>
          </div>
        </article>
      </main>
      <Footer footer={us.footer} country="us" />
    </>
  );
}
