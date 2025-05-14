# Base image for common dependencies
FROM --platform=linux/amd64 node:22-alpine AS build

# Set working directory
WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./tsconfig.base.json ./nx.json /app/

COPY ./backend/gateway/package.json /app/backend/gateway/
COPY ./backend/erxes-api-shared/package.json /app/backend/erxes-api-shared/

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install

# Build the test project
FROM --platform=linux/amd64 build AS gateway-build

# Copy source code
COPY ./backend/gateway /app/backend/gateway
COPY ./backend/erxes-api-shared /app/backend/erxes-api-shared

# Build following exact sequence
WORKDIR /app/backend/gateway

ENV NX_DAEMON=false
RUN npx nx build:packageJson gateway
RUN npx nx build gateway

# Final stage: Run the application
FROM --platform=linux/amd64 node:22-alpine as gateway

WORKDIR /app

# Copy built applications from previous stages
COPY --chown=1000 --from=gateway-build /app /app

# Install pnpm for production
RUN npm install -g pnpm

# Install production dependencies
WORKDIR /app/backend/gateway/dist

RUN apk add --no-cache curl ca-certificates \
    && pnpm store prune \
    && mkdir -p /src/apollo-router/temp \
    && cd /src/apollo-router/temp \
    && curl -sSL https://router.apollo.dev/download/nix/v1.59.2 | sh \
    && export PATH=$PATH:/root/.rover/bin \
    && /root/.rover/bin/rover supergraph compose --config /app/backend/gateway/dist/src/apollo-router/dummy/supergraph.yaml --elv2-license=accept \
    || (echo "Failed to compose supergraph" && exit 1)

RUN pnpm install

# Set environment variables
ENV NODE_ENV=production

# Use non root user
USER 1000

# Start the application
CMD ["node", "src/main.js"]
