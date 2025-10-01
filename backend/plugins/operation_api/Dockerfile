# Base image
FROM --platform=linux/amd64 node:22-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# Dependencies (cached layer)
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json nx.json ./
COPY backend/plugins/operation_api/package.json backend/plugins/operation_api/
COPY backend/erxes-api-shared/package.json backend/erxes-api-shared/
RUN pnpm install --frozen-lockfile

# Builder
FROM deps AS build
COPY . .
WORKDIR /app/backend/plugins/operation_api
ENV NX_DAEMON=false
RUN pnpm nx build:packageJson operation_api && pnpm nx build operation_api

# Production deps only
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json nx.json ./
COPY backend/plugins/operation_api/package.json backend/plugins/operation_api/
COPY backend/erxes-api-shared/package.json backend/erxes-api-shared/
RUN pnpm install --prod --frozen-lockfile

# Final runtime
FROM base AS runtime
WORKDIR /app
COPY --from=build /app/backend/plugins/operation_api/dist ./backend/plugins/operation_api/dist
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/backend/plugins/operation_api/node_modules ./backend/plugins/operation_api/node_modules
COPY --from=prod-deps /app/backend/erxes-api-shared/node_modules ./backend/erxes-api-shared/node_modules

ENV NODE_ENV=production
USER 1000

CMD ["node", "backend/plugins/operation_api/dist/src/main.js"]
