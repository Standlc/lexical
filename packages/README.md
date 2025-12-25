# Shared Packages

This directory contains shared packages that can be used across the monorepo.

## Structure

- **`api-types/`** - Shared tRPC router types
    - Re-exports the `AppRouter` type from the server
    - Used by the frontend to get type-safe API access

- **`utils/`** - Shared utility functions
    - Common functions used by both frontend and backend
    - Example: word formatting, validation, constants

## Creating a New Package

1. Create a new directory in `packages/`
2. Add a `package.json` with:
    - `name: "@lexical.app/your-package"`
    - `main` and `exports` pointing to your entry file
3. Add a `tsconfig.json` extending the base config
4. Update root `tsconfig.base.json` paths
5. Update `app/vite.config.ts` aliases (if needed by frontend)
6. Run `bun install` to link the workspace

## Usage Examples

### In the app (frontend):

```typescript
import type { AppRouter } from '@lexical.app/api-types';
import { formatWord } from '@lexical.app/utils';

const word = formatWord('Hello');
```

### In the server (backend):

```typescript
import { isValidWord } from '@lexical.app/utils';

if (isValidWord(input)) {
    // process word
}
```

## Common Package Types

- **`validators/`** - Shared Zod schemas for validation
- **`database/`** - Shared DB schemas, types, and queries
- **`config/`** - Shared configuration (constants, env vars)
- **`ui/`** - Shared React components (if needed)
- **`types/`** - Shared TypeScript types and interfaces


