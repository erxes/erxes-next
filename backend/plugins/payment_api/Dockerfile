# -------------------------
# Stage 0: Base + Install pnpm
FROM node:22-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# -------------------------
# Stage 1: Copy all source & install dependencies
FROM base AS deps
WORKDIR /app

# Copy root workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json nx.json ./

# Copy all local projects
COPY backend/erxes-api-shared ./backend/erxes-api-shared
COPY backend/plugins/payment_api ./backend/plugins/payment_api

# Install all dependencies including local packages
RUN pnpm install --frozen-lockfile

# -------------------------
# Stage 2: Build erxes-api-shared
FROM deps AS erxes-api-shared-build
WORKDIR /app
ENV NX_DAEMON=false
RUN pnpm nx build erxes-api-shared

# -------------------------
# Stage 3: Build payment_api backend
FROM deps AS payment_api-build
WORKDIR /app
ENV NX_DAEMON=false
RUN pnpm nx build:packageJson payment_api
RUN pnpm nx build payment_api

# -------------------------
# Stage 4: Build widget
FROM deps AS widget-build
WORKDIR /app/backend/plugins/payment_api/src/widget

# Install widget-specific deps (already linked via pnpm workspace)
RUN pnpm install --frozen-lockfile
RUN pnpm build

# -------------------------
# Stage 5: Final runtime image
FROM node:22-alpine AS payment_api
WORKDIR /app

# Copy built backend
COPY --from=payment_api-build /app/dist ./dist

# Copy built widget
COPY --from=widget-build /app/backend/plugins/payment_api/src/widget/dist ./dist/public/widget

# Use non-root user
USER 1000
ENV NODE_ENV=production

# Start backend
CMD ["node", "dist/src/main.js"]
