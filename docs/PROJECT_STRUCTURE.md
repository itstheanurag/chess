# Project Structure

```
chess/
├── backend/                  # Backend server code (Node.js, Express, Socket.IO)
│   ├── src/
│   │   ├── auth.ts           # Authentication logic
│   │   ├── config/           # Configuration files
│   │   ├── db/               # Database setup (Drizzle ORM)
│   │   │   ├── drizzle.ts    # Drizzle client configuration
│   │   │   └── schema.ts     # Database schema definitions
│   │   ├── games/            # Game logic and management
│   │   │   ├── cache.ts      # Game caching with Redis
│   │   │   ├── chess.game.ts # Chess game implementation
│   │   │   └── index.ts      # Game exports
│   │   ├── handler/          # Route handlers (controllers)
│   │   │   ├── chat.handler.ts    # Chat functionality
│   │   │   ├── game.handler.ts    # Game operations
│   │   │   ├── user.handler.ts    # User operations
│   │   │   └── index.ts
│   │   ├── libs/             # Core libraries
│   │   │   ├── cors.ts       # CORS configuration
│   │   │   ├── redis.ts      # Redis client setup
│   │   │   ├── server/       # Express server setup
│   │   │   └── socket/       # Socket.IO setup
│   │   │       ├── chat.socket.ts  # Chat socket handlers
│   │   │       ├── game.socket.ts  # Game socket handlers
│   │   │       └── index.ts
│   │   ├── middlewares/      # Express and socket middlewares
│   │   │   ├── app/          # Application middlewares
│   │   │   │   ├── error.middleware.ts
│   │   │   │   ├── logger.ts
│   │   │   │   ├── not.found.middleware.ts
│   │   │   │   └── routes.logger.ts
│   │   │   ├── auth.guard.ts      # Authentication guard
│   │   │   ├── socket.gaurd.ts    # Socket authentication
│   │   │   └── index.ts
│   │   ├── routes/           # Express routes
│   │   │   ├── game.route.ts      # Game endpoints
│   │   │   ├── user.route.ts      # User endpoints
│   │   │   └── index.ts
│   │   ├── schema/           # Zod validation schemas
│   │   │   ├── auth.ts       # Auth validation
│   │   │   ├── game.ts       # Game validation
│   │   │   └── index.ts
│   │   ├── storage/          # Data storage layer
│   │   │   ├── auth.ts       # Auth storage operations
│   │   │   └── game.ts       # Game storage operations
│   │   ├── types/            # TypeScript types
│   │   │   ├── chess.ts      # Chess-related types
│   │   │   ├── game.ts       # Game types
│   │   │   ├── token.ts      # Token types
│   │   │   ├── index.d.ts
│   │   │   └── index.ts
│   │   ├── utils/            # Utility functions
│   │   │   ├── helper.ts     # Helper functions
│   │   │   ├── password.ts   # Password utilities
│   │   │   └── index.ts
│   │   └── main.ts           # Backend entry point
│   ├── drizzle/              # Drizzle ORM migrations
│   ├── drizzle.config.ts     # Drizzle configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/                 # Frontend React application (Vite + React + TS)
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Home/         # Landing page components
│   │   │   │   ├── DailyPuzzle.tsx
│   │   │   │   ├── FAQ.tsx
│   │   │   │   ├── Features.tsx
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── HowItWorks.tsx
│   │   │   │   ├── Leaderboard.tsx
│   │   │   │   ├── LiveGamePreview.tsx
│   │   │   │   └── Testimonials.tsx
│   │   │   ├── pages/        # Page components
│   │   │   │   ├── auth/     # Authentication pages
│   │   │   │   │   ├── Login.tsx
│   │   │   │   │   ├── SignUp.tsx
│   │   │   │   │   └── User.tsx
│   │   │   │   ├── chat/     # Chat page
│   │   │   │   │   └── Chat.tsx
│   │   │   │   ├── chess/    # Chess game components
│   │   │   │   │   ├── ChessBoard.tsx
│   │   │   │   │   ├── ChessGamePage.tsx
│   │   │   │   │   ├── Game.tsx
│   │   │   │   │   ├── GameInfo.tsx
│   │   │   │   │   ├── Piece.tsx
│   │   │   │   │   └── Square.tsx
│   │   │   │   └── dashboard/  # Dashboard pages
│   │   │   │       ├── Dashboard.tsx
│   │   │   │       ├── Layout.tsx
│   │   │   │       ├── SideBar.tsx
│   │   │   │       └── Games/
│   │   │   │           ├── CreateGame.tsx
│   │   │   │           ├── GameCard.tsx
│   │   │   │           ├── GameCreatePage.tsx
│   │   │   │           ├── GameStats.tsx
│   │   │   │           ├── Modal.tsx
│   │   │   │           └── PaginatedCards.tsx
│   │   │   ├── ui/           # Reusable UI components
│   │   │   │   ├── buttons/  # Button components
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Loading.tsx
│   │   │   │   ├── Logo.tsx
│   │   │   │   └── Navbar.tsx
│   │   │   └── InputField.tsx
│   │   ├── routes/           # Route configuration
│   │   │   ├── ProtectedRoutes.tsx
│   │   │   ├── PublicRoutes.tsx
│   │   │   └── index.tsx
│   │   ├── stores/           # Zustand stores (state management)
│   │   │   ├── authStore.ts       # Authentication state
│   │   │   ├── chatStore.ts       # Chat state
│   │   │   ├── dashboardStore.ts  # Dashboard state
│   │   │   ├── games/             # Game-related stores
│   │   │   │   ├── chessStore.ts  # Chess game state
│   │   │   │   ├── socketStore.ts # Socket connection state
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── types/            # TypeScript types
│   │   │   ├── auth.ts       # Auth types
│   │   │   ├── chat.ts       # Chat types
│   │   │   ├── chess.ts      # Chess types
│   │   │   ├── server/       # Server response types
│   │   │   └── index.ts
│   │   ├── utils/            # Utility functions
│   │   │   ├── apis/         # API call functions
│   │   │   │   ├── auth.ts   # Auth API calls
│   │   │   │   ├── games.ts  # Game API calls
│   │   │   │   └── index.ts
│   │   │   ├── chess.utils.ts    # Chess utilities
│   │   │   ├── errors.ts         # Error handling
│   │   │   ├── square.ts         # Chess square utilities
│   │   │   ├── storage.ts        # Local storage utilities
│   │   │   ├── toast.ts          # Toast notifications
│   │   │   ├── utils.ts          # General utilities
│   │   │   └── index.ts
│   │   ├── lib/              # Third-party library setup
│   │   │   ├── auth-client.ts    # Better Auth client
│   │   │   ├── axios/            # Axios configuration
│   │   │   ├── sockets/          # Socket.IO client
│   │   │   └── index.ts
│   │   ├── App.tsx           # Main React component
│   │   ├── main.tsx          # Application entry point
│   │   ├── index.css         # Global styles
│   │   └── vite-env.d.ts     # Vite type definitions
│   ├── public/               # Static assets
│   ├── index.html
│   ├── vite.config.ts        # Vite configuration
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── eslint.config.js
│   └── .env.example
├── docs/                     # Documentation
│   ├── FEATURES.md           # Feature documentation
│   ├── TECH_STACK.md         # Technology stack details
│   ├── PROJECT_STRUCTURE.md  # This file
│   ├── SETUP.md              # Setup instructions
│   └── API.md                # API documentation
└── README.md                 # Project overview
```

## Directory Explanations

### Backend (`/backend`)

- **`src/auth.ts`** - Core authentication logic
- **`src/config/`** - Application configuration files
- **`src/db/`** - Database connection and schema using Drizzle ORM
- **`src/games/`** - Chess game logic, state management, and Redis caching
- **`src/handler/`** - HTTP request handlers (controllers)
- **`src/libs/`** - Core library setup (server, sockets, Redis, CORS)
- **`src/middlewares/`** - Express and Socket.IO middlewares
- **`src/routes/`** - API route definitions
- **`src/schema/`** - Zod validation schemas
- **`src/storage/`** - Data access layer for database operations
- **`src/types/`** - TypeScript type definitions
- **`src/utils/`** - Utility functions and helpers
- **`drizzle/`** - Database migrations generated by Drizzle Kit

### Frontend (`/frontend`)

- **`src/components/Home/`** - Landing page components
- **`src/components/pages/`** - Main application pages (auth, chess, dashboard, chat)
- **`src/components/ui/`** - Reusable UI components
- **`src/routes/`** - Route configuration and guards
- **`src/stores/`** - Zustand state management stores
- **`src/types/`** - TypeScript type definitions
- **`src/utils/`** - Utility functions and API calls
- **`src/lib/`** - Third-party library configurations
- **`public/`** - Static assets (images, fonts, etc.)
