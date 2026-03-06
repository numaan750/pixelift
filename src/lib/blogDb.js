import { getMongoDb } from "@/lib/mongodb";

function getCollectionName() {
  return (
    process.env.MONGODB_COLLECTION ||
    process.env.MONGODB_BLOG_COLLECTION ||
    "collection"
  );
}

function normalizePost(doc) {
  if (!doc) return null;
  const publishedAt = doc.publishedAt
    ? new Date(doc.publishedAt)
    : doc.created_at
      ? new Date(doc.created_at)
      : doc.createdAt
        ? new Date(doc.createdAt)
        : null;

  const date = publishedAt ? publishedAt.toISOString().slice(0, 10) : "";

  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description || doc.meta_description || "",
    excerpt: doc.excerpt || doc.meta_description || doc.description || "",
    date,
    relatedSlugs: Array.isArray(doc.relatedSlugs) ? doc.relatedSlugs : [],
    content_html: doc.content_html || "",
    content_markdown: doc.content_markdown || "",
    image_url: doc.image_url || "",
    tags: Array.isArray(doc.tags) ? doc.tags : [],
  };
}

export async function getAllBlogPostsFromDb({ limit = 200 } = {}) {
  const db = await getMongoDb();
  if (!db) return null;

  const collection = db.collection(getCollectionName());
  const docs = await collection
    .find({ slug: { $type: "string" } })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(limit)
    .toArray();

  return docs.map(normalizePost).filter(Boolean);
}

export async function getBlogPostBySlugFromDb(slug) {
  const db = await getMongoDb();
  if (!db) return null;

  const collection = db.collection(getCollectionName());
  const doc = await collection.findOne({ slug });
  return normalizePost(doc);
}

export async function ensureBlogIndexes() {
  const db = await getMongoDb();
  if (!db) return;

  const collection = db.collection(getCollectionName());
  await collection.createIndex({ slug: 1 }, { unique: true });
  await collection.createIndex({ publishedAt: -1 });
}
