# Available Scripts

## Backend Scripts

All backend scripts should be run from the `/backend` directory.

### Development

#### `pnpm dev`

Start the backend in development mode with hot-reload using tsx watch.

```bash
cd backend
pnpm dev
```

This will:

- Start the Express server
- Enable Socket.IO
- Watch for file changes and auto-reload
- Run on `http://localhost:3000` by default

---

### Build & Production

#### `pnpm build`

Compile TypeScript code to JavaScript.

```bash
pnpm build
```

Output directory: `dist/`

#### `pnpm start`

Start the backend in production mode (requires build first).

```bash
pnpm build
pnpm start
```

---

### Database

#### `pnpm db:generate`

Generate Drizzle ORM migration files based on schema changes.

```bash
pnpm db:generate
```

This creates migration files in the `drizzle/` directory.

#### `pnpm db:push`

Push the current schema directly to the database without generating migrations.

```bash
pnpm db:push
```

**Warning:** This is useful for development but not recommended for production.

---

### Code Quality

#### `pnpm lint`

Lint all TypeScript files in the `src/` directory.

```bash
pnpm lint
```

#### `pnpm type-check`

Run TypeScript type checking without emitting files.

```bash
pnpm type-check
```

---

## Frontend Scripts

All frontend scripts should be run from the `/frontend` directory.

### Development

#### `pnpm dev`

Start the frontend development server with hot-reload.

```bash
cd frontend
pnpm dev
```

This will:

- Start Vite dev server
- Enable hot module replacement (HMR)
- Open browser automatically at `http://localhost:5173`

---

### Build & Production

#### `pnpm build`

Build the frontend for production.

```bash
pnpm build
```

This will:

1. Run TypeScript compilation (`tsc -b`)
2. Build optimized production bundle with Vite
3. Output to `dist/` directory

#### `pnpm preview`

Preview the production build locally.

```bash
pnpm build
pnpm preview
```

Serves the production build at `http://localhost:4173`

---

### Code Quality

#### `pnpm lint`

Lint frontend code using ESLint.

```bash
pnpm lint
```

This checks:

- TypeScript/JavaScript files
- React component best practices
- React Hooks rules
- Code style issues

---

## Common Workflows

### Full Development Setup

```bash
# Terminal 1 - Backend
cd backend
pnpm install
pnpm db:push
pnpm dev

# Terminal 2 - Redis
redis-server

# Terminal 3 - Frontend
cd frontend
pnpm install
pnpm dev
```

### Production Build

```bash
# Build backend
cd backend
pnpm install
pnpm build

# Build frontend
cd frontend
pnpm install
pnpm build
```

### Code Quality Check

```bash
# Backend
cd backend
pnpm lint
pnpm type-check

# Frontend
cd frontend
pnpm lint
```

### Database Migration Workflow

```bash
# 1. Make changes to schema in backend/src/db/schema.ts

# 2. Generate migration
cd backend
pnpm db:generate

# 3. Review migration in drizzle/ directory

# 4. Apply migration (or use db:push for dev)
pnpm db:push
```

---

## Environment-Specific Commands

### Development

```bash
NODE_ENV=development pnpm dev
```

### Production

```bash
NODE_ENV=production pnpm start
```

---

## Troubleshooting Scripts

### Clear Build Cache

**Backend:**

```bash
cd backend
rm -rf dist node_modules
pnpm install
pnpm build
```

**Frontend:**

```bash
cd frontend
rm -rf dist node_modules .vite
pnpm install
pnpm build
```

### Reset Database

```bash
cd backend
# Drop and recreate database, then:
pnpm db:push
```

---

## Package Manager Notes

All scripts work with both `pnpm` (recommended) and `npm`:

```bash
# Using pnpm (recommended - faster, more efficient)
pnpm dev

# Using npm
npm run dev
```

**Why pnpm?**

- Faster installation
- More efficient disk space usage
- Stricter dependency resolution
- Better monorepo support
