# -------------------------
# Stage 0: Base + Install pnpm
FROM node:22-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# -------------------------
# Stage 1: Copy source & install dependencies
FROM base AS deps
WORKDIR /app

# Copy workspace root files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json nx.json ./

# Copy all source projects (no dist folders)
COPY backend/erxes-api-shared ./backend/erxes-api-shared
COPY backend/plugins/payment_api ./backend/plugins/payment_api

# Install dependencies for all workspace projects
# Use --no-frozen-lockfile to avoid lockfile mismatch issues
RUN pnpm install --no-frozen-lockfile

# -------------------------
# Stage 2: Build shared and backend projects
FROM deps AS build
WORKDIR /app
ENV NX_DAEMON=false

# Build erxes-api-shared first
RUN pnpm nx build erxes-api-shared

# Build payment_api backend
RUN pnpm nx build:packageJson payment_api
RUN pnpm nx build payment_api

# -------------------------
# Stage 3: Build widget
FROM deps AS widget-build
WORKDIR /app/backend/plugins/payment_api/src/widget

# Widget deps already installed via pnpm workspace
RUN pnpm build

# -------------------------
# Stage 4: Final runtime image
FROM node:22-alpine AS runtime
WORKDIR /app

# Copy built backend
COPY --from=build /app/dist ./dist

# Copy built widget
COPY --from=widget-build /app/backend/plugins/payment_api/src/widget/dist ./dist/public/widget

# Use non-root user
USER 1000
ENV NODE_ENV=production

# Start backend
CMD ["node", "dist/src/main.js"]
