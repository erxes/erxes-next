# -------------------------
# Stage 0: Base
FROM node:22-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# Copy root workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json nx.json ./

# Install root dependencies
RUN pnpm install --frozen-lockfile

# -------------------------
# Stage 1: Build erxes-api-shared
FROM base AS erxes-api-shared-build
WORKDIR /app
COPY backend/erxes-api-shared ./backend/erxes-api-shared
ENV NX_DAEMON=false
RUN pnpm nx build erxes-api-shared

# -------------------------
# Stage 2: Build payment_api backend
FROM base AS payment_api-build
WORKDIR /app
COPY backend/plugins/payment_api ./backend/plugins/payment_api
COPY --from=erxes-api-shared-build /app/dist ./dist
ENV NX_DAEMON=false
RUN pnpm nx build:packageJson payment_api
RUN pnpm nx build payment_api

# -------------------------
# Stage 3: Build widget
FROM base AS widget-build
WORKDIR /app/backend/plugins/payment_api/src/widget

# Copy widget source
COPY backend/plugins/payment_api/src/widget ./

# Install widget dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm build

# -------------------------
# Stage 4: Final runtime image
FROM node:22-alpine AS payment_api
WORKDIR /app

# Copy backend dist
COPY --from=payment_api-build /app/dist ./dist

# Copy built widget into public folder
COPY --from=widget-build /app/dist ./dist/public/widget

# Use non-root user
USER 1000
ENV NODE_ENV=production

# Start backend
CMD ["node", "src/main.js"]