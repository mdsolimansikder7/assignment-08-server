
import "dotenv/config";

import express from "express";
import cors from "cors";

import { connectDB } from "./db.js";
import { notFound, errorHandler } from "./verifyJwt.js";
import eventRoutes from "./routes/events.js";
import joinRoutes from "./routes/joins.js";

const app = express();


app.use(cors({ origin: process.env.CLIENT_URL }));

app.use(express.json({ limit: "1mb" }));
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Humanova API is running." });
});

app.use("/api/events", eventRoutes);
app.use("/api", joinRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Humanova API is running.",
    
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;

if (!process.env.VERCEL) {
  app.listen(process.env.PORT || 5000, () => {
    console.log("Humanova API is running.");
  });
}