# Use Bun's official image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies stage
FROM base AS deps
# Copy workspace configuration
COPY package.json bun.lock ./
COPY tsconfig.base.json ./

# Copy server package
COPY server/package.json ./server/

# Copy shared packages that the server depends on
COPY packages/api-types/package.json ./packages/api-types/
COPY packages/utils/package.json ./packages/utils/

# Install dependencies for the entire workspace
RUN bun install --frozen-lockfile

# Build stage (copy source code)
FROM base AS builder
WORKDIR /app

# Copy installed dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules

# Copy workspace configuration
COPY package.json bun.lock tsconfig.base.json ./

# Copy shared packages source code (the server needs these!)
COPY packages/api-types ./packages/api-types
COPY packages/utils ./packages/utils

# Copy server source code
COPY server ./server

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy everything needed to run the server
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server ./server
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.base.json ./tsconfig.base.json

WORKDIR /app/server

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]



