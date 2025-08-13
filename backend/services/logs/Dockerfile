# Stage 1: Build the application
FROM --platform=linux/amd64 node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json nx.json ./
COPY ./backend/erxes-api-shared/package.json ./backend/erxes-api-shared/
COPY ./backend/services/logs/package.json ./backend/services/logs/

RUN pnpm install --frozen-lockfile

COPY ./backend/erxes-api-shared ./backend/erxes-api-shared
COPY ./backend/services/logs ./backend/services/logs

WORKDIR /app/backend/services/logs
ENV NX_DAEMON=false
RUN npx nx build:packageJson logs-service
RUN npx nx build logs-service

# Stage 2: Production image
FROM --platform=linux/amd64 node:22-alpine

WORKDIR /app

COPY --from=builder /app/backend/services/logs/dist ./dist
COPY --from=builder /app/backend/services/logs/package.json ./
COPY --from=builder /app/node_modules ./node_modules

RUN npm install --omit=dev

ENV NODE_ENV=production

USER 1000

CMD ["node", "dist/src/main.js"]