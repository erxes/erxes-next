# Base image for building
FROM --platform=linux/amd64 node:22-alpine AS build

WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./tsconfig.base.json ./nx.json /app/
COPY ./backend/gateway/package.json /app/backend/gateway/
COPY ./backend/erxes-api-shared/package.json /app/backend/erxes-api-shared/

RUN npm install -g pnpm
RUN pnpm install

COPY ./backend/gateway /app/backend/gateway
COPY ./backend/erxes-api-shared /app/backend/erxes-api-shared

WORKDIR /app/backend/gateway

ENV NX_DAEMON=false
RUN npx nx build:packageJson gateway
RUN npx nx build gateway

# Final image
FROM --platform=linux/amd64 node:22-alpine as gateway

WORKDIR /app

# Install only required packages
RUN apk add --no-cache curl ca-certificates

# Copy built app from build stage
COPY --chown=1000 --from=build /app /app

# Install pnpm for production
RUN npm install -g pnpm

WORKDIR /app/backend/gateway/dist

# Download Apollo Router and compose supergraph
RUN mkdir -p /src/apollo-router/temp \
    && cd /src/apollo-router/temp \
    && curl -sSL https://router.apollo.dev/download/nix/v1.59.2 | sh \
    && mv ./router /usr/local/bin/apollo-router \
    && chmod +x /usr/local/bin/apollo-router \
    && /usr/local/bin/apollo-router --version

# Compose supergraph
RUN pnpm store prune \
    && pnpm install --prod \
    && /usr/local/bin/apollo-router supergraph compose --config /app/backend/gateway/dist/src/apollo-router/dummy/supergraph.yaml --elv2-license=accept \
    || (echo "Failed to compose supergraph" && exit 1)

ENV NODE_ENV=production

USER 1000

CMD ["node", "src/main.js"]
