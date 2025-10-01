
    FROM node:22-alpine AS base
    WORKDIR /app
    RUN npm install -g pnpm@8
    

    FROM base AS deps
    

    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json nx.json ./
    

    COPY backend/plugins/operation_api/package.json backend/plugins/operation_api/
    COPY backend/erxes-api-shared/package.json backend/erxes-api-shared/
    

    RUN pnpm install --frozen-lockfile
    

    RUN pnpm deploy --filter operation_api --prod /app/deploy
    

    FROM base AS runtime
    WORKDIR /app
    

    COPY backend/plugins/operation_api ./backend/plugins/operation_api
    COPY backend/erxes-api-shared ./backend/erxes-api-shared
    

    COPY --from=deps /app/deploy/node_modules ./node_modules
    

    COPY backend/plugins/operation_api/package.json ./backend/plugins/operation_api/package.json
    
    ENV NODE_ENV=production
    USER 1000
    
    CMD ["node", "backend/plugins/operation_api/dist/src/main.js"]
    