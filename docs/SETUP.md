# Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **pnpm** (recommended) or npm - Install pnpm: `npm install -g pnpm`
- **PostgreSQL** - [Download](https://www.postgresql.org/download/)
- **Redis** - [Download](https://redis.io/download/)

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and fill in the required values:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/chess_db

# Redis
REDIS_URL=redis://localhost:6379

# Server
PORT=3000
NODE_ENV=development

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 4. Database Setup

Generate and push the database schema:

```bash
# Generate migrations
pnpm db:generate
# or
npm run db:generate

# Push schema to database
pnpm db:push
# or
npm run db:push
```

### 5. Start Redis

Make sure Redis is running:

```bash
# On Linux/macOS
redis-server

# On Windows (if using WSL)
sudo service redis-server start
```

### 6. Start Backend Server

```bash
pnpm dev
# or
npm run dev
```

The backend will run on `http://localhost:3000` by default.

---

## Frontend Setup

### 1. Navigate to Frontend Directory

Open a new terminal and navigate to the frontend:

```bash
cd frontend
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and fill in the required values:

```env
# API URL
VITE_API_URL=http://localhost:3000

# Better Auth
VITE_BETTER_AUTH_URL=http://localhost:3000
```

### 4. Start Frontend Development Server

```bash
pnpm dev
# or
npm run dev
```

The frontend will open automatically in your default browser at `http://localhost:5173`.

---

## Verification

### Check Backend

1. Open `http://localhost:3000` in your browser
2. You should see the API response or status page

### Check Frontend

1. The frontend should automatically open at `http://localhost:5173`
2. You should see the landing page with the hero section

### Test Real-time Connection

1. Open the browser console (F12)
2. Navigate to the chess game page
3. Check for Socket.IO connection messages
4. You should see "Socket connected" or similar messages

---

## Troubleshooting

### Port Already in Use

If you get a "port already in use" error:

**Backend (Port 3000):**

```bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

**Frontend (Port 5173):**

```bash
# Find process using port 5173
lsof -i :5173
# Kill the process
kill -9 <PID>
```

### Database Connection Issues

1. Ensure PostgreSQL is running:

   ```bash
   # Check PostgreSQL status
   sudo service postgresql status
   ```

2. Verify database credentials in `.env`
3. Create the database if it doesn't exist:
   ```bash
   psql -U postgres
   CREATE DATABASE chess_db;
   ```

### Redis Connection Issues

1. Ensure Redis is running:

   ```bash
   redis-cli ping
   # Should return: PONG
   ```

2. Check Redis URL in `.env`

### Module Not Found Errors

Clear node_modules and reinstall:

```bash
# Backend
cd backend
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Frontend
cd frontend
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## Production Build

### Backend

```bash
cd backend
pnpm build
pnpm start
```

### Frontend

```bash
cd frontend
pnpm build
pnpm preview
```

---

## Docker Setup (Optional)

Coming soon...

---

## Next Steps

- Read the [API Documentation](./API.md)
- Explore the [Features](./FEATURES.md)
- Check the [Tech Stack](./TECH_STACK.md)
- Review the [Project Structure](./PROJECT_STRUCTURE.md)
