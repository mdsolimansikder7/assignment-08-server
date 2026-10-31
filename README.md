# Humanova API — Backend Server

Humanova API is the backend REST API for the Humanova Community Event Platform. It provides event management, event participation, authentication verification, and data management through MongoDB.

The API connects with the Humanova Next.js frontend and provides secure access to protected resources using JWT authentication.

## ✨ Features

- **Event Management:** Create, read, update, and delete community events.
- **Event Discovery:** Browse upcoming community events.
- **Search & Filtering:** Search events by keyword and filter by category.
- **Event Participation:** Join community events.
- **My Events:** Retrieve events created by the authenticated user.
- **Joined Events:** Retrieve events joined by the authenticated user.
- **JWT Authentication:** Verify authentication tokens using JWKS.
- **Authorization:** Restrict event management operations to their creators.
- **Input Validation:** Validate event information before saving.
- **MongoDB Integration:** Store events and participation records.
- **Database Optimization:** Automatically create database indexes.
- **Serverless Support:** Compatible with Vercel deployment.
- **CORS Configuration:** Allow frontend-to-backend communication.

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js 5 | REST API framework |
| MongoDB | NoSQL database |
| MongoDB Native Driver | Database operations |
| JOSE | JWT verification |
| JWKS | Public key retrieval |
| CORS | Cross-origin resource sharing |
| dotenv | Environment configuration |
| Nodemon | Development server |

## 📁 Project Structure

```text
assignment-08-server/
│
├── api/
│   └── index.js
│
├── routes/
│   ├── events.js
│   └── joins.js
│
├── db.js
├── helpers.js
├── verifyJwt.js
├── index.js
│
├── vercel.json
├── package.json
├── package-lock.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Before running the server, make sure you have:

- Node.js installed
- npm installed
- MongoDB Atlas account or local MongoDB
- Humanova frontend application
- Better Auth configured with JWT support

### 1. Clone the Repository

```bash
git clone https://github.com/mdsolimansikder7/assignment-08-server.git

cd assignment-08-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string
DB_NAME=humanova

CLIENT_URL=http://localhost:3000

JWKS_URL=http://localhost:3000/api/auth/jwks

APP_TIMEZONE=Asia/Dhaka
```

Replace the example values with your actual configuration.

**Important:** Never upload your `.env` file or database credentials to GitHub.

### 4. Start the Development Server

```bash
npm run dev
```

The server will start at:

```text
http://localhost:5000
```

### 5. Start Production Server

```bash
npm start
```

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server using Nodemon |
| `npm start` | Start production server |

## 🔗 API Endpoints

Base URL:

```text
http://localhost:5000/api
```

### Health Check

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/health` | Public | Check API status |

### Event Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/events` | Public | Get all upcoming events |
| GET | `/events/:id` | Public | Get a single event |
| GET | `/events/mine` | Protected | Get events created by the logged-in user |
| POST | `/events` | Protected | Create a new event |
| PUT | `/events/:id` | Owner only | Update an event |
| DELETE | `/events/:id` | Owner only | Delete an event |

### Event Participation Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/events/:id/join` | Protected | Join an event |
| GET | `/events/:id/joined` | Protected | Check whether the user joined |
| GET | `/joins/mine` | Protected | Get events joined by the current user |

### Event Query Parameters

The event listing endpoint supports:

| Parameter | Description |
|---|---|
| `limit` | Limit the number of returned events |
| `type` | Filter events by category |
| `search` | Search events by keyword |

Example:

```http
GET /api/events?limit=10&type=Cleanup
```

Search example:

```http
GET /api/events?search=tree
```

## 🔐 Authentication & Security

Humanova uses Better Auth on the frontend and JWT verification on the backend.

The backend verifies JWT tokens using the configured JWKS endpoint.

### How Authentication Works

1. A user signs in through Better Auth.
2. Better Auth generates a JWT token.
3. The frontend sends the token in the Authorization header.
4. The backend verifies the token using JWKS.
5. The authenticated user's email and name are attached to the request.
6. Protected API operations are processed only after successful verification.

### Authorization Header

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Protected endpoints require a valid JWT token.

Event update and delete operations also verify event ownership.

## 🗄️ Database Structure

Humanova uses MongoDB with two main collections.

### Events Collection

Stores community event information.

Typical fields include:

```json
{
  "_id": "ObjectId",
  "title": "Community Tree Plantation",
  "description": "Plant trees to make our community greener.",
  "eventType": "Plantation",
  "thumbnail": "https://example.com/image.jpg",
  "location": "Dhaka, Bangladesh",
  "eventDate": "2026-12-15",
  "creatorEmail": "user@example.com",
  "creatorName": "Community Organizer"
}
```

### Joins Collection

Stores event participation records.

```json
{
  "_id": "ObjectId",
  "eventId": "event_object_id",
  "userEmail": "user@example.com"
}
```

### Database Indexes

The backend creates indexes to improve query performance and prevent duplicate participation.

- Event date index
- Event creator email index
- Unique compound index for event ID and user email
- User email index for participation queries

## ✅ Event Validation

The backend validates event information before storing it.

Validation includes:

- Event title must be between 3 and 100 characters.
- Description must be between 20 and 1000 characters.
- Event category must be valid.
- Thumbnail must be a valid HTTP or HTTPS URL.
- Location must be between 3 and 120 characters.
- Event date must be a valid `YYYY-MM-DD` date.
- Past event dates are not allowed.

### Supported Event Categories

- Cleanup
- Plantation
- Donation
- Food Drive
- Health Camp
- Education
- Other

## 📦 API Response Format

API responses follow a consistent JSON structure.

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Something went wrong.",
  "errors": []
}
```

## 🌐 Deployment

The backend supports deployment on Vercel.

### Deploy Using Vercel

1. Import the GitHub repository into Vercel.
2. Configure the environment variables.
3. Add your MongoDB connection string.
4. Configure the production frontend URL in `CLIENT_URL`.
5. Configure `JWKS_URL` to point to the production frontend's Better Auth JWKS endpoint.
6. Deploy the project.
7. Test the API health endpoint.

### Production Environment Variables

```env
MONGODB_URI=your_production_mongodb_uri
DB_NAME=humanova

CLIENT_URL=https://your-frontend-domain.com

JWKS_URL=https://your-frontend-domain.com/api/auth/jwks

APP_TIMEZONE=Asia/Dhaka
```

## 🔗 Related Repository

**Humanova Frontend**

[View Frontend Repository](https://github.com/mdsolimansikder7/assignment-08-client)

## 👨‍💻 Author

**Md. Soliman Sikder**

- GitHub: [@mdsolimansikder7](https://github.com/mdsolimansikder7)

## 📌 Repository

[Humanova Backend — GitHub](https://github.com/mdsolimansikder7/assignment-08-server)

---

<p align="center">
  Built with Node.js, Express.js and MongoDB for a better-connected community. 💚
</p>
