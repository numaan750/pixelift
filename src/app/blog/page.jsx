import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogGridClient from "@/components/BlogGridClient";
import { us } from "@/app/constants/us";
import { absoluteUrl } from "@/lib/site";
import { safeJsonLdStringify } from "@/lib/structuredData";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { getAllBlogPostsFromDb } from "@/lib/blogDb";

export const metadata = {
  title: "Blog – AI Soulmate Drawings",
  description:
    "Articles and updates about the AI Soulmate Drawing Generator, how it works, and tips for better results.",
  alternates: { canonical: "/blog" },
  robots: { index: true, follow: true },
};

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
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
    ],
  };

  const dbPosts = await getAllBlogPostsFromDb({ limit: 60 });
  const posts = dbPosts?.length ? dbPosts : BLOG_POSTS;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbJsonLd) }}
      />
      <Navbar navLinks={us.navLinks} country="us" />
      <main className="bg-[#12171B] text-white">
        <div className="mycontainer py-10 md:py-14">
          <header className="max-w-3xl">
            <h1 className="text-[28px] sm:text-[36px] md:text-[44px] font-bold">
              Blog
            </h1>
            <p className="mt-3 text-[16px] sm:text-[18px] text-white">
              Practical tips, product notes, and guides for getting the most out of
              AI Soulmate Drawings.
            </p>
          </header>

          <BlogGridClient posts={posts} initialCount={12} step={12} />
        </div>
      </main>
      <Footer footer={us.footer} country="us" />
    </>
  );
}
