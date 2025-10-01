# ---------------------------
# Base image
# ---------------------------
    FROM node:22-alpine AS base
    WORKDIR /app
    RUN npm install -g pnpm@8
    
    # ---------------------------
    # Dependencies stage
    # ---------------------------
    FROM base AS deps
    
    # Copy workspace manifests
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json nx.json ./
    
    # Copy only package.json files for selective resolution
    COPY backend/plugins/operation_api/package.json backend/plugins/operation_api/
    COPY backend/erxes-api-shared/package.json backend/erxes-api-shared/
    
    # Install all deps (needed for deploy)
    RUN pnpm install --frozen-lockfile
    
    # Deploy only production deps for operation_api (and its deps)
    RUN pnpm deploy --filter operation_api --prod /app/deploy
    
    # ---------------------------
    # Runtime image
    # ---------------------------
    FROM base AS runtime
    WORKDIR /app
    
    # Copy built dist (already built in CI)
    COPY backend/plugins/operation_api ./backend/plugins/operation_api
    COPY backend/erxes-api-shared ./backend/erxes-api-shared
    
    # Copy pruned node_modules (only operation_api + deps)
    COPY --from=deps /app/deploy/node_modules ./node_modules
    COPY --from=deps /app/deploy/backend/plugins/operation_api/package.json ./backend/plugins/operation_api/package.json
    
    ENV NODE_ENV=production
    USER 1000
    
    CMD ["node", "backend/plugins/operation_api/dist/src/main.js"]
    