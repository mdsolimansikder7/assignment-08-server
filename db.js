// MongoDB connection with a cached client (important for Vercel serverless).
// Exports connectDB(), getEvents() and getJoins().

import { MongoClient } from "mongodb";

let client = null;
let db = null;
let connected = false;
let indexesCreated = false;

// Connect once and reuse the connection on every request.
export async function connectDB() {
  if (connected) {
    return db;
  }

  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
  }

  await client.connect();
  db = client.db(process.env.DB_NAME);

  // Create indexes only once, right after the first connection.
  if (!indexesCreated) {
    const events = db.collection("events");
    const joins = db.collection("joins");

    await events.createIndex({ eventDate: 1 });
    await events.createIndex({ creatorEmail: 1 });
    await joins.createIndex({ eventId: 1, userEmail: 1 }, { unique: true });
    await joins.createIndex({ userEmail: 1 });

    indexesCreated = true;
  }

  connected = true;
  return db;
}

// Returns the events collection. connectDB() must have run first.
export function getEvents() {
  return db.collection("events");
}

// Returns the joins collection. connectDB() must have run first.
export function getJoins() {
  return db.collection("joins");
}