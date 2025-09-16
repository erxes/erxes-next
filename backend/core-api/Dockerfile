# Base image for dependencies
FROM --platform=linux/amd64 node:22-alpine AS deps

# Install pnpm
RUN npm install -g pnpm@9.12.3

# Set working directory
WORKDIR /app

# Copy only package files for better layer caching
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./tsconfig.base.json ./nx.json /app/
COPY ./backend/core-api/package.json /app/backend/core-api/
COPY ./backend/erxes-api-shared/package.json /app/backend/erxes-api-shared/

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

# Build stage
FROM --platform=linux/amd64 deps AS builder

# Copy source code
COPY ./backend/core-api /app/backend/core-api
COPY ./backend/erxes-api-shared /app/backend/erxes-api-shared

# Set build environment
ENV NX_DAEMON=false
ENV NODE_ENV=production

# Build erxes-api-shared first
WORKDIR /app
RUN pnpm nx build erxes-api-shared

# Build core-api
WORKDIR /app/backend/core-api
RUN npx nx build:packageJson core-api
RUN npx nx build core-api

# Production dependencies stage
FROM --platform=linux/amd64 node:22-alpine AS prod-deps

# Install pnpm
RUN npm install -g pnpm@9.12.3

WORKDIR /app/backend/core-api/dist

# Copy built package.json
COPY --from=builder /app/backend/core-api/dist/package.json ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Final runtime stage
FROM --platform=linux/amd64 node:22-alpine AS runtime

WORKDIR /app

# Copy built application
COPY --from=builder --chown=node:node /app/backend/core-api/dist /app/
COPY --from=builder --chown=node:node /app/backend/erxes-api-shared/dist /app/node_modules/erxes-api-shared/dist/

# Copy production dependencies
COPY --from=prod-deps --chown=node:node /app/backend/core-api/dist/node_modules /app/node_modules/

# Set environment variables
ENV NODE_ENV=production

# Switch to non-root user
USER node

# Expose port (if needed)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node --version || exit 1

# Start the application
CMD ["node", "src/main.js"]

