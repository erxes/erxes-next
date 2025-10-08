# ---------- Build stage ----------
    FROM --platform=linux/amd64 node:22-bookworm AS build

    WORKDIR /app
    
    # Copy root manifests
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json nx.json ./
    COPY backend/gateway/package.json backend/gateway/
    COPY backend/erxes-api-shared/package.json backend/erxes-api-shared/
    
    # Install pnpm + deps
    RUN npm install -g pnpm
    RUN pnpm install
    
    # Copy source
    COPY backend/gateway ./backend/gateway
    COPY backend/erxes-api-shared ./backend/erxes-api-shared
    
    WORKDIR /app/backend/gateway
    ENV NX_DAEMON=false
    
    # Build gateway
    RUN npx nx build:packageJson gateway
    RUN npx nx build gateway
    
    # ---------- Runtime stage ----------
    FROM --platform=linux/amd64 node:22-bookworm AS runtime
    WORKDIR /app
    
    # Install required packages
    RUN apt-get update && apt-get install -y curl ca-certificates tar \
        && rm -rf /var/lib/apt/lists/*
    
    # Copy built app
    COPY --chown=1000:1000 --from=build /app /app
    
    # Install pnpm
    RUN npm install -g pnpm
    
    ENV PNPM_HOME="/root/.local/share/pnpm"
    ENV PATH="$PNPM_HOME:$PATH"
    
    # Rover CLI (optional)
    RUN pnpm add -g @apollo/rover@0.22.0 && pnpm cache clean \
        && rover supergraph compose \
           --config /app/backend/gateway/src/apollo-router/dummy/supergraph.yaml \
           --elv2-license=accept || true
    
    # Apollo Router install
    RUN mkdir -p /app/backend/gateway/dist/src/apollo-router/temp \
      && cd /app/backend/gateway/dist/src/apollo-router/temp \
      && VERSION=v1.59.2 \
      && curl -sSL -o router.tar.gz \
         "https://github.com/apollographql/router/releases/download/$VERSION/router-$VERSION-x86_64-unknown-linux-gnu.tar.gz" \
      && tar -xzf router.tar.gz \
      && mv router ./router \
      && chmod +x ./router
    
    WORKDIR /app/backend/gateway/dist
    
    ENV NODE_ENV=production
    USER 1000
    
    CMD ["node", "src/main.js"]
    