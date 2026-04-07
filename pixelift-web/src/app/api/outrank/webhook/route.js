import crypto from "crypto";
import { getMongoDbOrThrow } from "@/lib/mongodb";
import { ensureBlogIndexes } from "@/lib/blogDb";

function getExpectedToken() {
  return (
    process.env.OUTRANK_WEBHOOK_TOKEN ||
    process.env.OUTRANK_ACCESS_TOKEN ||
    ""
  );
}

function safeEqual(a, b) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function extractBearerToken(authHeader) {
  if (!authHeader) return "";
  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer") return "";
  return token || "";
}

function buildDeliveryKey(request, body) {
  return (
    request.headers.get("x-outrank-delivery-id") ||
    request.headers.get("x-delivery-id") ||
    body?.delivery_id ||
    body?.deliveryId ||
    `${body?.event_type || body?.event || "unknown"}:${body?.timestamp || body?.created_at || "unknown"}`
  );
}

function normalizeArticles(body) {
  if (!body) return [];

  // Outrank docs:
  // { event_type: "publish_articles", data: { articles: [...] } }
  const articles = body?.data?.articles;
  if (Array.isArray(articles)) return articles;

  // More generic webhook shape in other docs:
  // { event: "content.generated", data: {...} }
  const maybeOne = body?.data?.article;
  if (maybeOne && typeof maybeOne === "object") return [maybeOne];

  return [];
}

export async function POST(request) {
  const expectedToken = getExpectedToken();
  const token = extractBearerToken(request.headers.get("authorization"));

  if (!expectedToken || !token || !safeEqual(token, expectedToken)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = body?.event_type || body?.event;
  if (eventType !== "publish_articles" && eventType !== "content.generated") {
    return Response.json(
      { error: "Unsupported event", eventType },
      { status: 400 }
    );
  }

  const articles = normalizeArticles(body);
  if (!articles.length) {
    return Response.json({ ok: true, processed: 0, message: "No articles" });
  }

  const db = await getMongoDbOrThrow();
  await ensureBlogIndexes();

  const deliveries = db.collection("outrank_webhook_deliveries");
  await deliveries.createIndex({ deliveryKey: 1 }, { unique: true });

  const deliveryKey = buildDeliveryKey(request, body);
  try {
    await deliveries.insertOne({
      deliveryKey,
      receivedAt: new Date(),
      eventType,
    });
  } catch (err) {
    // Duplicate delivery; acknowledge so Outrank stops retrying.
    if (err?.code === 11000) {
      return Response.json({ ok: true, processed: 0, duplicate: true });
    }
    throw err;
  }

  const collectionName =
    process.env.MONGODB_COLLECTION ||
    process.env.MONGODB_BLOG_COLLECTION ||
    "collection";
  const posts = db.collection(collectionName);

  let processed = 0;
  let skipped = 0;

  for (const article of articles) {
    const slug = article?.slug;
    const title = article?.title;
    const content_html = article?.content_html;

    if (!slug || !title || !content_html) {
      skipped += 1;
      continue;
    }

    const publishedAt = article?.created_at ? new Date(article.created_at) : new Date();

    await posts.updateOne(
      { slug },
      {
        $setOnInsert: {
          createdAt: new Date(),
          source: "outrank",
        },
        $set: {
          slug,
          title,
          meta_description: article?.meta_description || "",
          description: article?.meta_description || "",
          excerpt: article?.meta_description || "",
          content_markdown: article?.content_markdown || "",
          content_html,
          image_url: article?.image_url || "",
          tags: Array.isArray(article?.tags) ? article.tags : [],
          publishedAt,
          updatedAt: new Date(),
          outrankId: article?.id || null,
        },
      },
      { upsert: true }
    );

    processed += 1;
  }

  return Response.json({ ok: true, processed, skipped });
}
