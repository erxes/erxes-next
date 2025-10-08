# Base image
FROM node:22-alpine AS base
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Fix pnpm global bin issue
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

# ------------------- Deps stage -------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json nx.json ./
COPY backend/gateway/package.json backend/gateway/
COPY backend/erxes-api-shared/package.json backend/erxes-api-shared/

RUN pnpm install --prod --frozen-lockfile

# ------------------- Runtime stage -------------------
FROM base AS runtime
WORKDIR /app

COPY backend/gateway ./backend/gateway
COPY backend/erxes-api-shared ./backend/erxes-api-shared

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/gateway/node_modules ./backend/gateway/node_modules
COPY --from=deps /app/backend/erxes-api-shared/node_modules ./backend/erxes-api-shared/node_modules

# ---- Apollo Router setup ----
RUN apk add --no-cache curl tar ca-certificates

# Install Rover CLI (optional, only if you need composition at runtime)
RUN pnpm add -g @apollo/rover@0.22.0 && pnpm cache clean

# Dummy composition (optional)
RUN rover supergraph compose \
    --config /app/backend/gateway/src/apollo-router/dummy/supergraph.yaml \
    --elv2-license=accept || true

# Prepare folder
RUN mkdir -p /app/backend/gateway/dist/src/apollo-router/temp

# Download Apollo Router binary (multi-arch safe)
RUN cd /app/backend/gateway/dist/src/apollo-router/temp \
    && VERSION=v1.59.2 \
    && ARCH="$(uname -m)" \
    && case "$ARCH" in \
         x86_64)  PLATFORM="x86_64-unknown-linux-gnu" ;; \
         aarch64) PLATFORM="aarch64-unknown-linux-gnu" ;; \
         *) echo "Unsupported arch: $ARCH" && exit 1 ;; \
       esac \
    && curl -sSL -o router.tar.gz \
       "https://github.com/apollographql/router/releases/download/$VERSION/router-$VERSION-$PLATFORM.tar.gz" \
    && tar -xzf router.tar.gz \
    && mv router ./router \
    && chmod +x ./router

# ---- Environment & security ----
ENV NODE_ENV=production
USER 1000

CMD ["node", "backend/gateway/dist/src/main.js"]
