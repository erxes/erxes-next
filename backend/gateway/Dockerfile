# ---------- Base stage ----------
    FROM node:22-bookworm AS base
    WORKDIR /app
    
    # Install pnpm globally
    RUN npm install -g pnpm
    
    # Fix pnpm global bin issue
    ENV PNPM_HOME="/root/.local/share/pnpm"
    ENV PATH="${PNPM_HOME}:${PATH}"
    
    # ---------- Dependencies stage ----------
    FROM base AS deps
    
    # Copy root manifests
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json nx.json ./
    
    # Copy selective package.json files
    COPY backend/gateway/package.json backend/gateway/
    COPY backend/erxes-api-shared/package.json backend/erxes-api-shared/
    
    # Install only production dependencies
    RUN pnpm install --prod --frozen-lockfile
    
    # ---------- Build stage ----------
    FROM base AS build
    
    # Copy source code
    COPY backend/gateway ./backend/gateway
    COPY backend/erxes-api-shared ./backend/erxes-api-shared
    
    WORKDIR /app/backend/gateway
    
    ENV NX_DAEMON=false
    
    # Build with Nx
    RUN npx nx build:packageJson gateway
    RUN npx nx build gateway
    
    # ---------- Runtime stage ----------
    FROM node:22-bookworm AS runtime
    WORKDIR /app
    
    # Copy built app and node_modules
    COPY --from=build /app /app
    COPY --from=deps /app/node_modules ./node_modules
    COPY --from=deps /app/backend/gateway/node_modules ./backend/gateway/node_modules
    COPY --from=deps /app/backend/erxes-api-shared/node_modules ./backend/erxes-api-shared/node_modules
    
    # Install runtime deps
    RUN apt-get update && apt-get install -y curl ca-certificates tar \
        && rm -rf /var/lib/apt/lists/*
    
    # ---- Rover CLI (optional) ----
    RUN pnpm add -g @apollo/rover@0.22.0 && pnpm cache clean \
        && rover supergraph compose \
           --config /app/backend/gateway/src/apollo-router/dummy/supergraph.yaml \
           --elv2-license=accept || true
    
    # ---- Apollo Router binary install (multi-arch safe) ----
    RUN mkdir -p /app/backend/gateway/dist/src/apollo-router/temp \
      && cd /app/backend/gateway/dist/src/apollo-router/temp \
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
    
    WORKDIR /app/backend/gateway/dist
    
    ENV NODE_ENV=production
    USER 1000
    
    CMD ["node", "src/main.js"]
    