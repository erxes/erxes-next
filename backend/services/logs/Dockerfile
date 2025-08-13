# ---------- Base Build Stage ----------
    FROM --platform=linux/amd64 node:22-alpine AS build

    WORKDIR /app
    
    COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./tsconfig.base.json ./nx.json ./
    COPY ./backend/services/logs/package.json ./backend/services/logs/
    COPY ./backend/erxes-api-shared/package.json ./backend/erxes-api-shared/
    
    RUN npm install -g pnpm && pnpm install --frozen-lockfile
    
    # Copy only source needed for this service + shared
    COPY ./backend/services/logs ./backend/services/logs
    COPY ./backend/erxes-api-shared ./backend/erxes-api-shared
    
    WORKDIR /app/backend/services/logs
    ENV NX_DAEMON=false
    RUN npx nx build:packageJson logs-service && npx nx build logs-service
    
    # Install prod deps for dist
    WORKDIR /app/backend/services/logs/dist
    RUN pnpm install --prod --frozen-lockfile
    
    # ---------- Final Runtime Stage ----------
    FROM --platform=linux/amd64 node:22-alpine AS runtime
    
    WORKDIR /app
    COPY --from=build /app/backend/services/logs/dist ./
    
    ENV NODE_ENV=production
    USER 1000
    
    CMD ["node", "src/main.js"]
    