# Base image for common dependencies
FROM --platform=linux/amd64 node:22-alpine AS build

# Set working directory
WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./tsconfig.base.json ./nx.json /app/

COPY ./backend/plugins/operation_api/package.json /app/backend/plugins/operation_api/
COPY ./backend/erxes-api-shared/package.json /app/backend/erxes-api-shared/

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install

# Build the test project
FROM --platform=linux/amd64 build AS operation_api-build

# Copy source code
COPY ./backend/plugins/operation_api /app/backend/plugins/operation_api
COPY ./backend/erxes-api-shared /app/backend/erxes-api-shared

# Build following exact sequence
WORKDIR /app/backend/plugins/operation_api

ENV NX_DAEMON=false
RUN npx nx build:packageJson operation_api
RUN npx nx build operation_api

# Final stage: Run the application
FROM --platform=linux/amd64 node:22-alpine as operation_api

WORKDIR /app

# Copy built applications from previous stages
COPY --chown=1000 --from=operation_api-build /app /app

# Install pnpm for production
RUN npm install -g pnpm

# Install production dependencies
WORKDIR /app/backend/plugins/operation_api/dist
RUN pnpm install

# Set environment variables
ENV NODE_ENV=production

# Use non root user
USER 1000

# Start the application
CMD ["node", "src/main.js"]

