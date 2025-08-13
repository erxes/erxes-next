# ---------- Build Stage ----------
    FROM --platform=linux/amd64 node:22-alpine AS build

    WORKDIR /app
    
    # Copy workspace manifests
    COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./tsconfig.base.json ./nx.json /app/
    COPY ./backend/services/logs/package.json /app/backend/services/logs/
    COPY ./backend/erxes-api-shared/package.json /app/backend/erxes-api-shared/
    
    # Install pnpm and deps
    RUN npm install -g pnpm && pnpm install --frozen-lockfile
    
    # Copy source code
    COPY ./backend/services/logs /app/backend/services/logs
    COPY ./backend/erxes-api-shared /app/backend/erxes-api-shared
    
    # Build the service
    ENV NX_DAEMON=false
    RUN npx nx build:packageJson logs-service \
     && npx nx build logs-service
    
    # Install only production deps for dist
    WORKDIR /app/backend/services/logs/dist
    RUN pnpm install --prod --frozen-lockfile
    
    # ---------- Runtime Stage ----------
    FROM --platform=linux/amd64 node:22-alpine AS runtime
    
    WORKDIR /app
    
    # Copy built code & production node_modules only
    COPY --from=build /app/backend/services/logs/dist /app
    
    ENV NODE_ENV=production
    USER 1000
    
    CMD ["node", "src/main.js"]
    