# Base image for common dependencies
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./tsconfig.base.json ./nx.json /app/

COPY ./backend/core-api/package.json /app/backend/core-api/
COPY ./backend/erxes-api-shared/package.json /app/backend/erxes-api-shared/

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install

# Build the test project
FROM build as core-api-build

# Copy source code
COPY ./backend/core-api /app/backend/core-api
COPY ./backend/erxes-api-shared /app/backend/erxes-api-shared

# Build following exact sequence
WORKDIR /app/backend/core-api

ENV NX_DAEMON=false
RUN npx nx build:packageJson core-api
RUN npx nx build core-api

# Final stage: Run the application
FROM node:22-alpine as core-api

WORKDIR /app

# Copy built applications from previous stages
COPY --chown=1000 --from=core-api-build /app /app

# Install pnpm for production
RUN npm install -g pnpm

# Install production dependencies
WORKDIR /app/backend/core-api/dist
RUN pnpm install

# Set environment variables
ENV NODE_ENV=production

# Use non root user
USER 1000

# Start the application
CMD ["node", "src/main.js"]

