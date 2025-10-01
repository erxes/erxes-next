# Base image
FROM node:22-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# Dependencies (install all)
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json nx.json ./
COPY backend/plugins/operation_api/package.json backend/plugins/operation_api/
COPY backend/erxes-api-shared/package.json backend/erxes-api-shared/
RUN pnpm install --frozen-lockfile

# Prune only production deps
FROM deps AS pruned
RUN pnpm prune --prod \
  && pnpm store prune \
  && rm -rf /root/.pnpm-store

# Runtime image
FROM node:22-alpine AS runtime
WORKDIR /app

# Copy only dist + package.json (NO sources)
COPY backend/plugins/operation_api/dist ./backend/plugins/operation_api/dist
COPY backend/plugins/operation_api/package.json ./backend/plugins/operation_api/
COPY backend/erxes-api-shared/dist ./backend/erxes-api-shared/dist
COPY backend/erxes-api-shared/package.json ./backend/erxes-api-shared/

# Copy pruned production node_modules
COPY --from=pruned /app/node_modules ./node_modules
COPY --from=pruned /app/backend/plugins/operation_api/node_modules ./backend/plugins/operation_api/node_modules
COPY --from=pruned /app/backend/erxes-api-shared/node_modules ./backend/erxes-api-shared/node_modules

# Environment & security
ENV NODE_ENV=production
USER 1000

# Start the app
CMD ["node", "backend/plugins/operation_api/dist/src/main.js"]
