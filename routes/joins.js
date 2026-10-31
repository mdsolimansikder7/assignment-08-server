
import { Router } from "express";
import { ObjectId } from "mongodb";

import { getEvents, getJoins } from "../db.js";
import { verifyJWT } from "../middleware.js";
import { getToday, isValidId } from "../helpers.js";

const router = Router();

router.post("/events/:id/join", verifyJWT, async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ success: false, message: "Invalid event id." });
  }

  const event = await getEvents().findOne({ _id: new ObjectId(id) });

  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found." });
  }

  if (event.eventDate < getToday()) {
    return res.status(400).json({ success: false, message: "This event has already passed." });
  }

  try {
    await getJoins().insertOne({
      eventId: new ObjectId(id),
      userEmail: req.user.email,
      userName: req.user.name,
      joinedAt: new Date(),
    });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({ success: false, message: "You have already joined this event." });
    }
    throw error;
  }

  res.status(201).json({ success: true, message: "Joined event successfully." });
});

router.get("/events/:id/joined", verifyJWT, async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ success: false, message: "Invalid event id." });
  }

  const join = await getJoins().findOne({
    eventId: new ObjectId(id),
    userEmail: req.user.email,
  });

  res.json({ success: true, message: "Join status fetched successfully.", data: { joined: !!join } });
});

router.get("/joins/mine", verifyJWT, async (req, res) => {
  const events = await getJoins()
    .aggregate([
      { $match: { userEmail: req.user.email } },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      { $sort: { "event.eventDate": 1 } },
      { $replaceRoot: { newRoot: "$event" } },
    ])
    .toArray();

  res.json({ success: true, message: "Joined events fetched successfully.", data: events });
});

export default router;