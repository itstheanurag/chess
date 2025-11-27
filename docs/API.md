# API Documentation

## Base URL

```
http://localhost:3000
```

---

## Authentication

The API uses Better Auth for authentication with cookie-based sessions.

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Logout

```http
POST /api/auth/logout
```

#### Get Current User

```http
GET /api/auth/session
```

---

## Game Endpoints

### Get All Games

```http
GET /api/games
```

**Query Parameters:**

- `page` (optional) - Page number for pagination (default: 1)
- `limit` (optional) - Number of games per page (default: 10)
- `status` (optional) - Filter by game status: `waiting`, `active`, `completed`

**Response:**

```json
{
  "games": [
    {
      "id": "uuid",
      "whitePlayer": "user-id",
      "blackPlayer": "user-id",
      "status": "active",
      "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      "createdAt": "2025-11-27T08:00:00Z",
      "updatedAt": "2025-11-27T08:30:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

### Create Game

```http
POST /api/games
Content-Type: application/json
Authorization: Required

{
  "timeControl": "10+0",
  "isPrivate": false
}
```

**Response:**

```json
{
  "gameId": "uuid",
  "status": "waiting",
  "createdAt": "2025-11-27T08:00:00Z"
}
```

### Get Game by ID

```http
GET /api/games/:gameId
```

**Response:**

```json
{
  "id": "uuid",
  "whitePlayer": {
    "id": "user-id",
    "name": "John Doe",
    "rating": 1500
  },
  "blackPlayer": {
    "id": "user-id",
    "name": "Jane Smith",
    "rating": 1520
  },
  "status": "active",
  "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "moves": [],
  "createdAt": "2025-11-27T08:00:00Z",
  "updatedAt": "2025-11-27T08:30:00Z"
}
```

### Join Game

```http
POST /api/games/:gameId/join
Authorization: Required
```

### Get Game History

```http
GET /api/games/history
Authorization: Required
```

---

## User Endpoints

### Get User Profile

```http
GET /api/users/:userId
```

**Response:**

```json
{
  "id": "user-id",
  "name": "John Doe",
  "email": "user@example.com",
  "rating": 1500,
  "gamesPlayed": 50,
  "wins": 25,
  "losses": 20,
  "draws": 5,
  "createdAt": "2025-01-01T00:00:00Z"
}
```

### Update User Profile

```http
PATCH /api/users/profile
Content-Type: application/json
Authorization: Required

{
  "name": "John Smith",
  "avatar": "url-to-avatar"
}
```

### Get Leaderboard

```http
GET /api/users/leaderboard
```

**Query Parameters:**

- `limit` (optional) - Number of users to return (default: 10)

**Response:**

```json
{
  "leaderboard": [
    {
      "rank": 1,
      "id": "user-id",
      "name": "Top Player",
      "rating": 2000,
      "gamesPlayed": 200
    }
  ]
}
```

---

## WebSocket Events

### Connection

```javascript
import io from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token: "your-auth-token",
  },
});
```

### Game Events

#### Join Game Room

```javascript
socket.emit("game:join", { gameId: "uuid" });
```

#### Make Move

```javascript
socket.emit("game:move", {
  gameId: "uuid",
  from: "e2",
  to: "e4",
  promotion: "q", // optional, for pawn promotion
});
```

#### Listen for Moves

```javascript
socket.on("game:move", (data) => {
  console.log("Move made:", data);
  // data: { from, to, promotion, fen, turn }
});
```

#### Listen for Game Over

```javascript
socket.on("game:over", (data) => {
  console.log("Game over:", data);
  // data: { winner, reason, fen }
});
```

#### Leave Game

```javascript
socket.emit("game:leave", { gameId: "uuid" });
```

### Chat Events

#### Send Message

```javascript
socket.emit("chat:message", {
  gameId: "uuid",
  message: "Good game!",
});
```

#### Receive Message

```javascript
socket.on("chat:message", (data) => {
  console.log("New message:", data);
  // data: { userId, userName, message, timestamp }
});
```

### Connection Events

#### Connected

```javascript
socket.on("connect", () => {
  console.log("Connected to server");
});
```

#### Disconnected

```javascript
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
```

#### Error

```javascript
socket.on("error", (error) => {
  console.error("Socket error:", error);
});
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "statusCode": 400
  }
}
```

### Common Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **Game endpoints**: 30 requests per minute
- **User endpoints**: 20 requests per minute

---

## Pagination

Endpoints that return lists support pagination:

**Request:**

```http
GET /api/games?page=2&limit=20
```

**Response:**

```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": true
  }
}
```

---

## Data Validation

All request bodies are validated using Zod schemas. Invalid requests will return a `400` error with details about the validation failure.

**Example Error:**

```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "statusCode": 400,
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```
