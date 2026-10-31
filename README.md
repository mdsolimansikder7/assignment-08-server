# Humanova API

Backend REST API for the **Humanova** community event platform. It serves events and join records to the Humanova Next.js client. Authentication is handled on the client with BetterAuth; this server only verifies the JWT sent in the `Authorization` header.

## Tech Stack

- Node.js + Express 5
- MongoDB (native driver, no Mongoose)
- JWT verification with `jose` (JWKS)
- CORS, dotenv

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and fill in your values:

   ```bash
   cp .env.example .env
   ```

3. Run locally:

   ```bash
   npm run dev
   ```

   The API starts on `http://localhost:5000` (or `PORT` from `.env`).

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Local server port (default `5000`). Not needed on Vercel. |
| `MONGODB_URI` | MongoDB Atlas connection string. |
| `DB_NAME` | Database name (e.g. `humanova`). |
| `CLIENT_URL` | Frontend URL, no trailing slash. |
| `JWKS_URL` | Client JWKS URL (`<client-url>/api/auth/jwks`). |
| `APP_TIMEZONE` | Timezone for "today" calculation (e.g. `Asia/Dhaka`). |

## API Endpoints

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/api/health` | Public | Health check |
| GET | `/api/events` | Public | Upcoming events (supports `limit`, `type`, `search`) |
| GET | `/api/events/mine` | JWT | Events created by the logged-in user |
| GET | `/api/events/:id` | Public | Single event |
| POST | `/api/events` | JWT | Create an event |
| PUT | `/api/events/:id` | JWT, owner | Update an event |
| DELETE | `/api/events/:id` | JWT, owner | Delete an event and its joins |
| POST | `/api/events/:id/join` | JWT | Join an event |
| GET | `/api/events/:id/joined` | JWT | Whether the user joined the event |
| GET | `/api/joins/mine` | JWT | Events joined by the logged-in user |

All responses use the shape `{ success, message, data?, errors? }`.