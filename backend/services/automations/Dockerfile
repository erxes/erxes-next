# Base image for common dependencies
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# 1. First copy only dependency-related files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json nx.json ./
COPY ./backend/erxes-api-shared/package.json ./backend/erxes-api-shared/
COPY ./backend/services/automations/package.json ./backend/services/automations/

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# 2. Build stage for shared library
FROM builder AS shared-builder
COPY ./backend/erxes-api-shared ./backend/erxes-api-shared
WORKDIR /app/backend/erxes-api-shared
RUN npx nx build

# 3. Build stage for automations
FROM builder AS automations-builder

# Copy built shared library
COPY --from=shared-builder /app/backend/erxes-api-shared /app/backend/erxes-api-shared

# Copy automations source code (excluding dist folder if it exists)
COPY ./backend/services/automations ./backend/services/automations

# Create proper module symlinks
RUN ln -s /app/backend/erxes-api-shared /app/node_modules/erxes-api-shared

WORKDIR /app/backend/services/automations

# Environment settings
ENV NX_DAEMON=false
ENV NX_CLOUD_DISTRIBUTED_EXECUTION=false
ENV NODE_PATH=/app/node_modules

# Clear caches and build
RUN rm -rf node_modules/.cache/nx && \
    npx nx reset && \
    npx nx build:packageJson automations-service --verbose && \
    npx nx build automations-service --verbose

# 4. Final production image
FROM node:22-alpine

WORKDIR /app

# Copy built artifacts
COPY --from=automations-builder --chown=1000:1000 /app/backend/services/automations/dist ./dist
COPY --from=shared-builder --chown=1000:1000 /app/backend/erxes-api-shared/dist ./node_modules/erxes-api-shared

# Install production dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && \
    pnpm install --prod && \
    rm -rf /tmp/* /var/tmp/*

# Environment variables
ENV NODE_ENV=production
USER 1000

CMD ["node", "dist/src/main.js"]