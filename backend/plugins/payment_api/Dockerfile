# -------------------------
# Stage 0: Base + Install pnpm
FROM node:22-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# -------------------------
# Stage 1: Copy source & install workspace dependencies
FROM base AS deps
WORKDIR /app

# Copy workspace root files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json nx.json ./

# Copy all backend projects
COPY backend/erxes-api-shared ./backend/erxes-api-shared
COPY backend/plugins/payment_api ./backend/plugins/payment_api

# Install dependencies for the entire monorepo
RUN pnpm install --no-frozen-lockfile

# -------------------------
# Stage 2: Build backend
FROM deps AS build
WORKDIR /app
ENV NX_DAEMON=false

# Build shared libs first
RUN pnpm nx build erxes-api-shared

# Build backend app
RUN pnpm nx build payment_api

# -------------------------
# Stage 3: Build widget (lighter)
FROM base AS widget-build
WORKDIR /app/widget

# Copy only the widget package.json and source
COPY backend/plugins/payment_api/src/widget/package.json ./
COPY backend/plugins/payment_api/src/widget ./src

# Install only widget deps
RUN pnpm install --no-frozen-lockfile

# Build widget with Vite
RUN pnpm build --cwd ./src

# -------------------------
# Stage 4: Runtime
FROM node:22-alpine AS runtime
WORKDIR /app

# Copy backend build
COPY --from=build /app/dist ./dist

# Copy widget build
COPY --from=widget-build /app/widget/dist ./dist/public/widget

# Use non-root user
USER 1000
ENV NODE_ENV=production

# Start backend
CMD ["node", "dist/src/main.js"]
