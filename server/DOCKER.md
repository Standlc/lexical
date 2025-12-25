# Docker Deployment Guide

This guide explains how to dockerize the backend server with shared monorepo packages.

## Quick Start

```bash
# Build the Docker image
bun run docker:build

# Run the container
bun run docker:run

# Or use docker-compose
bun run docker:up
```

## Understanding the Dockerfile

### Key Challenge: Monorepo + Shared Packages

When dockerizing a monorepo, the challenge is that the `server` depends on code in `packages/`. Docker must include these shared packages in the image.

### Solution: Multi-stage Build

Our Dockerfile uses a multi-stage build:

```dockerfile
1. deps stage    → Install dependencies
2. builder stage → Copy source code (server + packages)
3. runner stage  → Minimal production image
```

### What Gets Copied

```
Docker Image
├── node_modules/           # All dependencies
├── packages/
│   ├── api-types/          # Shared types (needed at runtime)
│   └── utils/              # Shared utilities (needed at runtime)
└── server/
    └── src/
        ├── index.ts        # Server entry point
        └── trpc.ts         # tRPC setup
```

## File Structure

- **`Dockerfile`** - Standard Docker build (good for development)
- **`Dockerfile.prod`** - Optimized for production (smaller image, security hardened)
- **`.dockerignore`** - Excludes unnecessary files from Docker context

## Docker Commands

### Build

```bash
# Development build
docker build -f server/Dockerfile -t lexical-server .

# Production build (optimized, Alpine-based)
docker build -f server/Dockerfile.prod -t lexical-server:prod .
```

**Important**: The build context is the **root directory** (`.`), not `./server/`, because we need access to `packages/`.

### Run

```bash
# Run with port mapping
docker run -p 3000:3000 lexical-server

# Run with environment variables
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgres://... \
  lexical-server

# Run in detached mode
docker run -d -p 3000:3000 --name lexical-server lexical-server
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f server

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## Environment Variables

Create a `.env` file in the root:

```env
NODE_ENV=production
DATABASE_URL=postgres://user:pass@postgres:5432/lexical
PORT=3000
```

Then use it with docker-compose:

```bash
docker-compose --env-file .env up -d
```

## Why Shared Packages Work

### TypeScript Path Resolution

The server's imports work because:

1. **`tsconfig.base.json`** defines path mappings:

    ```json
    "paths": {
      "@lexical.app/utils": ["./packages/utils/src/index.ts"]
    }
    ```

2. **Bun's runtime** resolves these paths at runtime (no build step needed!)

3. **Docker includes both** `server/` and `packages/` in the image

### Development vs Production

**Development** (local):

- Workspace symlinks via `bun install`
- Changes to packages instantly reflect
- No Docker needed

**Production** (Docker):

- Real copies of packages in the image
- Immutable, consistent environment
- Portable across any server

## Optimization Tips

### 1. Layer Caching

Order matters! Put rarely-changed files first:

```dockerfile
# ✅ Good - package.json changes less often
COPY package.json bun.lock ./
RUN bun install
COPY src ./src

# ❌ Bad - source changes often, invalidates cache
COPY src ./src
COPY package.json bun.lock ./
RUN bun install
```

### 2. Use .dockerignore

Exclude files that shouldn't be in the Docker context:

```
node_modules
.git
*.md
.env.local
```

### 3. Multi-stage Builds

Use `Dockerfile.prod` for production:

- Smaller final image (Alpine-based)
- Production dependencies only
- Non-root user for security
- Health checks included

### 4. Build Only What's Needed

If a shared package has a build step:

```dockerfile
FROM base AS builder
WORKDIR /app
COPY packages/validators ./packages/validators
RUN cd packages/validators && bun run build
```

## Common Issues

### ❌ "Cannot find module '@lexical.app/utils'"

**Cause**: Shared packages not copied to Docker image

**Fix**: Ensure `COPY packages ./packages` in Dockerfile

### ❌ "ENOENT: no such file or directory"

**Cause**: Build context is wrong

**Fix**: Run `docker build` from **root directory**, not `server/`:

```bash
# ✅ Correct
docker build -f server/Dockerfile -t lexical-server .

# ❌ Wrong
cd server && docker build -f Dockerfile -t lexical-server .
```

### ❌ Image is too large

**Cause**: Using development Dockerfile

**Fix**: Use `Dockerfile.prod` for production:

```bash
docker build -f server/Dockerfile.prod -t lexical-server:prod .
```

## Production Deployment

### Deploy to Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Create app
fly launch

# Deploy
fly deploy --dockerfile server/Dockerfile.prod
```

### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Deploy to AWS ECS/Fargate

1. Push image to ECR:

```bash
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

docker tag lexical-server:prod <account>.dkr.ecr.us-east-1.amazonaws.com/lexical-server:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/lexical-server:latest
```

2. Create ECS task definition using the pushed image

## Summary

✅ **Build context** must be the monorepo root  
✅ **Include shared packages** in the Docker image  
✅ **Use multi-stage builds** to optimize image size  
✅ **Bun resolves paths** at runtime (no transpilation needed)  
✅ **Development**: use `Dockerfile`  
✅ **Production**: use `Dockerfile.prod`





