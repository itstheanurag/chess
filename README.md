# Chess Game

A real-time multiplayer chess game built with Node.js, Express, Socket.IO, React, and chess.js.

---

## Features

- Real-time multiplayer gameplay
- Move validation using chess.js
- Support for special moves (castling, en passant, promotion)
- Game over detection (checkmate, stalemate, draw)
- Responsive design
- User authentication (JWT)
- Leaderboards, puzzles, and chat

---

## Requirements

- **Node.js** (v14 or higher)
- **pnpm** (recommended) or npm
- **Redis** (for backend caching/sessions)
- **Prisma** (ORM for backend, uses SQLite/Postgres/MySQL)
- **Vite** (for frontend development)

---

## Project Structure

```
chess/
├── backend/                  # Backend server code (Node.js, Express, Socket.IO)
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── handler/          # Route handlers (controllers)
│   │   ├── libs/             # Libraries (db, redis, socket, server)
│   │   ├── middlewares/      # Express and socket middlewares
│   │   ├── routes/           # Express routes
│   │   ├── schema/           # Zod validation schemas
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utility functions
│   │   └── main.ts           # Backend entry point
│   ├── prisma/               # Prisma schema and migrations
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/                 # Frontend React application (Vite + React + TS)
│   ├── src/
│   │   ├── components/       # React components (pages, UI, Home, etc.)
│   │   ├── stores/           # Zustand stores (state management)
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utility functions and API calls
│   │   ├── lib/              # Axios and socket.io client setup
│   │   └── App.tsx           # Main React component
│   ├── index.html
│   ├── index.css
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── README.md                 # Project documentation
```

---

## Tech Stack

### Backend

- **Node.js** & **Express** — REST API server
- **Socket.IO** — Real-time communication
- **Prisma** — ORM for database access
- **Redis** — Caching/session management
- **chess.js** — Chess rules and move validation
- **Zod** — Schema validation
- **JWT** — Authentication

### Frontend

- **React** (with TypeScript)
- **Vite** — Fast development server and build tool
- **Zustand** — State management
- **Socket.IO Client** — Real-time updates
- **Axios** — HTTP requests
- **Tailwind CSS** — Styling
- **React Toastify** — Notifications

---

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Set up your environment variables:
   - Copy `.env.example` to `.env` and fill in the required values.

4. Run database migrations (if using Prisma):
   ```bash
   pnpm prisma migrate dev
   # or
   npx prisma migrate dev
   ```

5. Start the backend server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```
   The backend will run on `http://localhost:3000` by default.

---

### Frontend Setup

1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Set up your environment variables:
   - Copy `.env.example` to `.env` and fill in the required values (API URL, etc).

4. Start the frontend development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```
   The frontend will open automatically in your default browser at `http://localhost:5173` (or as configured).

---

## Scripts

### Backend (`backend/package.json`)

- `pnpm dev` — Start the backend in development mode (with nodemon)
- `pnpm build` — Build the backend TypeScript code
- `pnpm start` — Start the backend in production mode

### Frontend (`frontend/package.json`)

- `pnpm dev` — Start the frontend development server
- `pnpm build` — Build the frontend for production
- `pnpm preview` — Preview the production build

---

## License

This project is open source and available under the [MIT License](LICENSE).