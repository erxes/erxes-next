# Base image for common dependencies
FROM --platform=linux/amd64 node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy workspace root config files
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./tsconfig.base.json ./nx.json /app/

# Copy relevant project package.json files
COPY ./backend/services/automations/package.json /app/backend/services/automations/
COPY ./backend/erxes-api-shared/package.json /app/backend/erxes-api-shared/

# Install pnpm and monorepo dependencies
RUN npm install -g pnpm
RUN pnpm install

# Build stage for the automations service
FROM --platform=linux/amd64 build AS automations-build

# Copy full source code needed for build
COPY ./backend/services/automations /app/backend/services/automations
COPY ./backend/erxes-api-shared /app/backend/erxes-api-shared

# Set working directory to automations
WORKDIR /app/backend/services/automations

# Avoid background processes and ensure fresh project graph
ENV NX_DAEMON=false

# Reset project graph and build
RUN npx nx reset && npx nx build:packageJson automations && npx nx build automations

# Final runtime image
FROM --platform=linux/amd64 node:22-alpine as automations

WORKDIR /app

# Copy built app from previous stage
COPY --chown=1000:1000 --from=automations-build /app /app

# Install pnpm for production
RUN npm install -g pnpm

# Install only production dependencies inside dist folder
WORKDIR /app/backend/services/automations/dist
RUN pnpm install --prod

# Set environment variables
ENV NODE_ENV=production

# Use non-root user for safety
USER 1000

# Start the application
CMD ["node", "src/main.js"]
