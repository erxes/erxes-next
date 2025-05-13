# Syntax version
FROM node:22-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/gateway/package.json ./backend/gateway/
COPY backend/erxes-api-shared/package.json ./backend/erxes-api-shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN pnpm nx build gateway && \
    pnpm nx build:packageJson gateway

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/backend/gateway/dist ./
COPY --from=builder /app/backend/gateway/package.json ./

# Install production dependencies
RUN npm install -g pnpm && \
    pnpm install --prod --frozen-lockfile

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000

# Use non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "src/main.js"]


