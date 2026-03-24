FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

# ─── Install ───
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile --filter api

# ─── Build ───
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY apps/api ./apps/api
RUN cd apps/api && npx prisma generate && pnpm run build

# ─── Production ───
FROM node:20-alpine AS production
WORKDIR /app

COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/apps/api/package.json ./package.json
COPY --from=build /app/apps/api/prisma ./prisma

RUN mkdir -p uploads

EXPOSE 4000
CMD ["node", "dist/main"]
