
export const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Food Drive",
  "Health Camp",
  "Education",
  "Other",
];


export function getToday() {
  const timeZone = process.env.APP_TIMEZONE || "Asia/Dhaka";
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
}

export function isValidDateString(text) {
  if (typeof text !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;

  const [year, month, day] = text.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}


export function isValidId(id) {
  return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
}

(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


export function validateEvent(body) {
  const input = body || {};
  const data = {};
  const errors = [];


  const title = String(input.title ?? "").trim();
  data.title = title;
  if (!title) {
    errors.push("Title is required.");
  } else if (title.length < 3) {
    errors.push("Title must be at least 3 characters.");
  } else if (title.length > 100) {
    errors.push("Title must be at most 100 characters.");
  }


  const description = String(input.description ?? "").trim();
  data.description = description;
  if (!description) {
    errors.push("Description is required.");
  } else if (description.length < 20) {
    errors.push("Description must be at least 20 characters.");
  } else if (description.length > 1000) {
    errors.push("Description must be at most 1000 characters.");
  }


  const eventType = String(input.eventType ?? "").trim();
  data.eventType = eventType;
  if (!eventType) {
    errors.push("Event type is required.");
  } else if (!EVENT_TYPES.includes(eventType)) {
    errors.push("Event type is invalid.");
  }

 
  const thumbnail = String(input.thumbnail ?? "").trim();
  data.thumbnail = thumbnail;
  if (!thumbnail) {
    errors.push("Thumbnail is required.");
  } else {
    try {
      const url = new URL(thumbnail);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        errors.push("Thumbnail must be a valid http or https URL.");
      }
    } catch (error) {
      errors.push("Thumbnail must be a valid http or https URL.");
    }
  }

  const location = String(input.location ?? "").trim();
  data.location = location;
  if (!location) {
    errors.push("Location is required.");
  } else if (location.length < 3) {
    errors.push("Location must be at least 3 characters.");
  } else if (location.length > 120) {
    errors.push("Location must be at most 120 characters.");
  }


  const eventDate = String(input.eventDate ?? "").trim();
  data.eventDate = eventDate;
  if (!eventDate) {
    errors.push("Event date is required.");
  } else if (!isValidDateString(eventDate)) {
    errors.push("Event date must be a real date in YYYY-MM-DD format.");
  } else if (eventDate < getToday()) {
    errors.push("Event date cannot be in the past.");
  }

  return { data, errors };
}