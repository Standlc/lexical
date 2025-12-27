# Lexical

Monorepo with React frontend, Hono API, and shared packages.

## Structure

```
├── apps/
│   ├── api/        → Backend (Hono, port 3001)
│   └── web/        → Frontend (React + Vite, port 3000)
├── packages/
│   └── shared/     → Shared types & utilities
```

## Getting Started

```bash
npm install
npm run dev
```

| Command           | Description        |
| ----------------- | ------------------ |
| `npm run dev`     | Run both apps      |
| `npm run dev:web` | Run frontend only  |
| `npm run dev:api` | Run backend only   |
| `npm run build`   | Build all packages |

## Shared Package

Import from `@lexical/shared` in either app:

```ts
import { APP_NAME, type User } from "@lexical/shared";
```

Types and utilities defined in `packages/shared/src/index.ts` are available to both frontend and backend.

## API Proxy

The frontend proxies `/api/*` requests to the backend. In `apps/web/vite.config.ts`:

```ts
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
}
```

So `fetch('/api/users/1')` in the frontend hits `http://localhost:3001/users/1`.
