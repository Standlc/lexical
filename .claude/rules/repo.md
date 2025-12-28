# Lexical

Monorepo for a vocabulary/dictionary app with React frontend and Hono API.

## Stack

| Layer    | Tech                                                  |
| -------- | ----------------------------------------------------- |
| Frontend | React 19, Vite, TanStack Router, TanStack Query, tRPC |
| Styling  | Tailwind CSS 4, shadcn/ui components                  |
| Backend  | Hono, tRPC, Vercel AI SDK (OpenAI)                    |
| Database | PostgreSQL 16 (Docker), Drizzle ORM                   |

## Structure

```
├── apps/
│   ├── api/        → Backend (Hono + tRPC, port 5000)
│   └── web/        → Frontend (React + Vite, port 3000)
```

## Getting Started

```bash
npm install
npm run db:start   # Start PostgreSQL
npm run db:migrate # Run migrations
npm run dev        # Start both apps
```

## Commands

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Run both apps                                    |
| `npm run dev:web` | Run frontend only                                |
| `npm run dev:api` | Run backend only                                 |
| `npm run db:*`    | Database commands (start, stop, migrate, studio) |

## Architecture

**tRPC Integration**: The API exports `AppRouter` type which the frontend imports directly for end-to-end type safety. No separate shared package needed.

**API Proxy**: Frontend proxies `/api/*` to `http://localhost:5000`. tRPC endpoint is at `/api/trpc`.

**Database**: Drizzle ORM with PostgreSQL. Schema in `apps/api/src/db/schema.ts`. Migrations in `apps/api/drizzle/migrations/`.
