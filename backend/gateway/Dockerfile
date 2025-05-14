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
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk update \
    && apk add --no-cache curl ca-certificates \
    && pnpm add -g @apollo/rover@0.22.0 \
    && pnpm store prune

RUN mkdir -p /app/backend/gateway/dist/src/apollo-router/temp \
    && chown -R 1000:1000 /app/backend/gateway/dist/src/apollo-router

USER 1000

RUN cd /app/backend/gateway/dist/src/apollo-router/temp \
    && (export VERSION=v1.59.2; curl -sSL https://router.apollo.dev/download/nix/v1.59.2 | sh)

ENV NODE_ENV=production

CMD ["node", "src/main.js"]
