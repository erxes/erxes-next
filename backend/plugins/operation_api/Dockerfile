# Base image
FROM node:22-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# Dependencies (production only)
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json nx.json ./
COPY backend/plugins/operation_api/package.json backend/plugins/operation_api/
COPY backend/erxes-api-shared/package.json backend/erxes-api-shared/

RUN pnpm install --prod --frozen-lockfile

# Runtime image
FROM base AS runtime
WORKDIR /app

WORKDIR /app/backend/plugins/operation_api/dist
RUN pnpm install --filter operation_api, erxes-api-shared

WORKDIR /app

# Copy built dist from CI (nx build already ran in workflow)
COPY backend/plugins/operation_api ./backend/plugins/operation_api
COPY backend/erxes-api-shared ./backend/erxes-api-shared

RUN rm -rf node_modules

ENV NODE_ENV=production
USER 1000

WORKDIR /app/backend/plugins/operation_api/dist

CMD ["node", "src/main.js"]
