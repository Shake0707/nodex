FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

# ─── Install ───
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
# packages/shared must exist for pnpm workspace resolution
COPY packages/ ./packages/
RUN pnpm install --frozen-lockfile --filter api...

# ─── Build ───
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY apps/api ./apps/api
COPY packages/ ./packages/
RUN cd apps/api && pnpm exec prisma generate && pnpm run build

# ─── Production ───
FROM node:20-alpine AS production
WORKDIR /app

COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/prisma ./prisma
COPY apps/api/prisma.config.prod.js ./prisma.config.js

# Use npm (not pnpm) for production deps — avoids pnpm virtual-store
# symlink issues in multi-stage Docker builds.
COPY apps/api/package.json ./package.json
RUN npm install --omit=dev

# Generate Prisma client for the Alpine platform.
RUN ./node_modules/.bin/prisma generate --schema=prisma/schema.prisma

RUN mkdir -p uploads

EXPOSE 4000
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node dist/src/main"]
