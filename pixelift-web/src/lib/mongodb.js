import { MongoClient } from "mongodb";

function normalizeMongoUri(raw) {
  if (!raw) return "";

  let value = String(raw).trim();

  // Common misconfig: pasting `MONGO_URI=mongodb+srv://...` as the *value*.
  const eqIndex = value.indexOf("=");
  if (eqIndex > 0) {
    const maybeKey = value.slice(0, eqIndex).trim();
    if (maybeKey === "MONGO_URI" || maybeKey === "MONGODB_URI") {
      value = value.slice(eqIndex + 1).trim();
    }
  }

  // Strip surrounding quotes if present.
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }

  // Validate scheme early so MongoClient doesn't throw.
  if (!value.startsWith("mongodb://") && !value.startsWith("mongodb+srv://")) {
    return "";
  }

  return value;
}

const uri = normalizeMongoUri(process.env.MONGODB_URI || process.env.MONGO_URI);

function getDbNameFromUri(mongoUri) {
  if (!mongoUri) return null;
  try {
    const url = new URL(mongoUri);
    const pathname = url.pathname || "";
    const dbName = pathname.startsWith("/") ? pathname.slice(1) : pathname;
    return dbName || null;
  } catch {
    return null;
  }
}

function getMongoDbName() {
  return (
    process.env.MONGODB_DB ||
    getDbNameFromUri(uri) ||
    null
  );
}

/**
 * Returns a connected MongoClient, or null if MongoDB is not configured.
 * (Does not throw at import-time to keep builds working without env vars.)
 */
export function getMongoClientPromise() {
  if (!uri) return null;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      try {
        const client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
      } catch {
        return null;
      }
    }
    return global._mongoClientPromise;
  }

  if (!global._mongoClientPromiseProd) {
    try {
      const client = new MongoClient(uri);
      global._mongoClientPromiseProd = client.connect();
    } catch {
      return null;
    }
  }
  return global._mongoClientPromiseProd;
}

export async function getMongoDb() {
  const clientPromise = getMongoClientPromise();
  if (!clientPromise) return null;
  const client = await clientPromise;

  const dbName = getMongoDbName();
  if (!dbName) return null;

  return client.db(dbName);
}

export async function getMongoDbOrThrow() {
  const db = await getMongoDb();
  if (!db) {
    throw new Error(
      "MongoDB is not configured. Set MONGODB_URI (or MONGO_URI) and MONGODB_DB."
    );
  }
  return db;
}
