# Step 1: Base image for build with specified platform (for M1/M2 chip compatibility)
FROM --platform=linux/amd64 node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy root-level config files
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./tsconfig.base.json ./nx.json /app/

# Copy project-level package.json files
COPY ./backend/gateway/package.json /app/backend/gateway/
COPY ./backend/erxes-api-shared/package.json /app/backend/erxes-api-shared/

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Step 2: Build the gateway project
FROM --platform=linux/amd64 build AS gateway-build

# Copy full source code
COPY ./backend/gateway /app/backend/gateway
COPY ./backend/erxes-api-shared /app/backend/erxes-api-shared

# Build the gateway project
WORKDIR /app/backend/gateway

ENV NX_DAEMON=false
RUN npx nx build:packageJson gateway
RUN npx nx build gateway

# Step 3: Final runtime image
FROM --platform=linux/amd64 node:22-alpine AS gateway

# Create app directory
WORKDIR /app

# Copy only the built application from previous stage
COPY --chown=1000 --from=gateway-build /app/backend/gateway/dist /app

# Copy production node_modules (if needed)
COPY --chown=1000 --from=gateway-build /app/backend/gateway/node_modules /app/node_modules

# Use non-root user
USER 1000

# Set environment variable
ENV NODE_ENV=production

# Start the application
CMD ["node", "src/main.js"]
