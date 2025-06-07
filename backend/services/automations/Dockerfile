# Base image for common dependencies
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache git

# Copy package files
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./tsconfig.base.json ./nx.json /app/
COPY ./backend/services/automations/package.json /app/backend/services/automations/
COPY ./backend/erxes-api-shared/package.json /app/backend/erxes-api-shared/

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install

# Build stage
FROM build AS automations-build

# Copy source code (exclude dist folders)
COPY ./backend/services/automations /app/backend/services/automations
RUN rm -rf /app/backend/services/automations/dist
COPY ./backend/erxes-api-shared /app/backend/erxes-api-shared

# Set NX environment variables
ENV NX_DAEMON=false
ENV NX_CACHE_PROJECT_GRAPH=false
ENV NX_SOCKET_DIR=/tmp/nx-tmp

# Build steps
WORKDIR /app/backend/services/automations
RUN npx nx reset
RUN npx nx build:packageJson automations --verbose
RUN npx nx build automations --verbose

# Final runtime image
FROM node:22-alpine as automations

WORKDIR /app

# Copy built applications
COPY --chown=1000 --from=automations-build /app /app

# Install pnpm for production
RUN npm install -g pnpm

# Install production dependencies
WORKDIR /app/backend/services/automations/dist
RUN pnpm install --prod

# Set environment variables
ENV NODE_ENV=production

# Use non-root user
USER 1000

# Start the application
CMD ["node", "src/main.js"]