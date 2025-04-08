# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy root configuration files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./

# Copy the shared package
COPY backend/erxes-shared ./backend/erxes-shared

# Copy the test service with all config files
COPY backend/test/package.json backend/test/tsconfig.json backend/test/tsconfig.build.json ./backend/test/
COPY backend/test/src ./backend/test/src

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the application
RUN cd backend/test && pnpm run build

# Build shared package
RUN cd backend/erxes-shared && pnpm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-workspace.yaml ./

# Copy the shared package
COPY --from=builder /app/backend/erxes-shared/package.json ./backend/erxes-shared/package.json
COPY --from=builder /app/backend/erxes-shared/dist ./backend/erxes-shared/dist

# Copy test service
COPY --from=builder /app/backend/test/dist ./backend/test/dist
COPY --from=builder /app/backend/test/package.json ./backend/test/package.json
COPY --from=builder /app/tsconfig.base.json ./
COPY --from=builder /app/backend/test/tsconfig.json ./

# Set working directory to test service
WORKDIR /app/backend/test

# Install production dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm install --prod --workspace-root && \
    pnpm add tsconfig-paths

# Set environment variables
ENV NODE_ENV=production

# Expose the port your app runs on
EXPOSE 3000

# Start the application using the correct start command with path aliases
CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]
