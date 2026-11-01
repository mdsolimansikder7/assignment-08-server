import { Router } from "express";
import { ObjectId } from "mongodb";

import { getEvents, getJoins } from "../db.js";
import { verifyJWT } from "../verifyJwt.js";
import {
  getToday,
  isValidId,
  escapeRegex,
  EVENT_TYPES,
  validateEvent,
} from "../helpers.js";

const router = Router();

router.get("/", async (req, res) => {
  const today = getToday();
  const filter = { eventDate: { $gte: today } };

  const { type, search, limit } = req.query;

  if (typeof type === "string" && EVENT_TYPES.includes(type)) {
    filter.eventType = type;
  }

  if (typeof search === "string" && search.trim()) {
    const safe = escapeRegex(search.trim());
    filter.$or = [
      { title: { $regex: safe, $options: "i" } },
      { location: { $regex: safe, $options: "i" } },
    ];
  }

  let query = getEvents().find(filter).sort({ eventDate: 1 });

  // Apply limit only when it is a valid number between 1 and 50.
  if (limit !== undefined) {
    const n = Number(limit);
    if (Number.isInteger(n) && n >= 1 && n <= 50) {
      query = query.limit(n);
    }
  }

  const events = await query.toArray();
  res.json({
    success: true,
    message: "Events fetched successfully.",
    data: events,
  });
});

router.get("/mine", verifyJWT, async (req, res) => {
  const events = await getEvents()
    .find({ creatorEmail: req.user.email })
    .sort({ createdAt: -1 })
    .toArray();

  res.json({
    success: true,
    message: "Events fetched successfully.",
    data: events,
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid event id." });
  }

  const event = await getEvents().findOne({ _id: new ObjectId(id) });

  if (!event) {
    return res
      .status(404)
      .json({ success: false, message: "Event not found." });
  }

  res.json({
    success: true,
    message: "Event fetched successfully.",
    data: event,
  });
});

router.post("/", verifyJWT, async (req, res) => {
  const { data, errors } = validateEvent(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Please fix the highlighted fields.",
      errors,
    });
  }

  const now = new Date();
  const newEvent = {
    title: data.title,
    description: data.description,
    eventType: data.eventType,
    thumbnail: data.thumbnail,
    location: data.location,
    eventDate: data.eventDate,
    creatorEmail: req.user.email,
    creatorName: req.user.name,
    createdAt: now,
    updatedAt: now,
  };

  const result = await getEvents().insertOne(newEvent);
  newEvent._id = result.insertedId;

  res.status(201).json({
    success: true,
    message: "Event created successfully.",
    data: newEvent,
  });
});

router.put("/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid event id." });
  }

  const event = await getEvents().findOne({ _id: new ObjectId(id) });

  if (!event) {
    return res
      .status(404)
      .json({ success: false, message: "Event not found." });
  }

  if (event.creatorEmail !== req.user.email) {
    return res
      .status(403)
      .json({
        success: false,
        message: "You can only update your own events.",
      });
  }

  const { data, errors } = validateEvent(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Please fix the highlighted fields.",
      errors,
    });
  }

  await getEvents().updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title: data.title,
        description: data.description,
        eventType: data.eventType,
        thumbnail: data.thumbnail,
        location: data.location,
        eventDate: data.eventDate,
        updatedAt: new Date(),
      },
    },
  );

  const updated = await getEvents().findOne({ _id: new ObjectId(id) });

  res.json({
    success: true,
    message: "Event updated successfully.",
    data: updated,
  });
});

router.delete("/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid event id." });
  }

  const event = await getEvents().findOne({ _id: new ObjectId(id) });

  if (!event) {
    return res
      .status(404)
      .json({ success: false, message: "Event not found." });
  }

  if (event.creatorEmail !== req.user.email) {
    return res
      .status(403)
      .json({
        success: false,
        message: "You can only delete your own events.",
      });
  }

  await getEvents().deleteOne({ _id: new ObjectId(id) });
  await getJoins().deleteMany({ eventId: new ObjectId(id) });

  res.json({ success: true, message: "Event deleted successfully." });
});

export default router;
