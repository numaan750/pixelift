import { countries } from "@/lib/countries";
import { absoluteUrl } from "@/lib/site";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { getAllBlogPostsFromDb } from "@/lib/blogDb";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap() {
  const lastModified = new Date();
  const countryUrls = Object.keys(countries).map((code) => ({
    url: absoluteUrl(`/${code}`),
    lastModified,
    priority: 0.9,
  }));

  const dbPosts = await getAllBlogPostsFromDb({ limit: 1000 });
  const posts = dbPosts?.length ? dbPosts : BLOG_POSTS;

  const blogPostUrls = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified,
    priority: 0.5,
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      priority: 1,
    },
    ...countryUrls,
    {
      url: absoluteUrl("/conditions"),
      lastModified,
      priority: 0.4,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified,
      priority: 0.5,
    },
    {
      url: absoluteUrl("/privecypolice"),
      lastModified,
      priority: 0.4,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified,
      priority: 0.6,
    },
    ...blogPostUrls,
  ];
}
