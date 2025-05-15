# Syntax
FROM --platform=linux/amd64 node:22-alpine AS deps

# Set working directory
WORKDIR /app

# Install pnpm globally in a separate layer
RUN npm install -g pnpm

# Copy only package files for better caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/core-api/package.json ./backend/core-api/
COPY backend/erxes-api-shared/package.json ./backend/erxes-api-shared/

# Install dependencies with frozen lockfile and production only
RUN pnpm install --frozen-lockfile --prod

# Builder stage
FROM --platform=linux/amd64 node:22-alpine AS builder

WORKDIR /app

# Copy pnpm and node_modules from deps stage
COPY --from=deps /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=deps /usr/local/bin/pnpm /usr/local/bin/pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/core-api/node_modules ./backend/core-api/node_modules
COPY --from=deps /app/backend/erxes-api-shared/node_modules ./backend/erxes-api-shared/node_modules

# Copy source files
COPY . .

# Build the project
ENV NX_DAEMON=false
RUN pnpm nx build:packageJson core-api && \
    pnpm nx build core-api

# Production stage
FROM --platform=linux/amd64 node:22-alpine AS runner

WORKDIR /app

# Copy only the necessary files from builder
COPY --from=builder /app/backend/core-api/dist ./
COPY --from=builder /app/backend/core-api/package.json ./

# Install production dependencies only
RUN npm install -g pnpm && \
    pnpm install --prod --frozen-lockfile && \
    pnpm store prune

# Set production environment
ENV NODE_ENV=production

# Use non-root user for security
USER node

# Start the application
CMD ["node", "src/main.js"]

