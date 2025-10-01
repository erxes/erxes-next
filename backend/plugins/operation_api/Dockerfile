# Base image
FROM node:22-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# Dependencies (production only)
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json nx.json ./
COPY backend/plugins/operation_api/package.json backend/plugins/operation_api/
COPY backend/erxes-api-shared/package.json backend/erxes-api-shared/

RUN pnpm install --prod --frozen-lockfile

# Runtime image
FROM base AS runtime

WORKDIR /app

# Copy built dist from CI (nx build already ran in workflow)
COPY backend/plugins/operation_api ./backend/plugins/operation_api
COPY backend/erxes-api-shared ./backend/erxes-api-shared



# Copy production node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/plugins/operation_api/node_modules ./backend/plugins/operation_api/node_modules
COPY --from=deps /app/backend/erxes-api-shared/node_modules ./backend/erxes-api-shared/node_modules

WORKDIR /app/backend/plugins/operation_api/dist

RUN pnpm install


WORKDIR /app

RUN rm -rf node_modules

ENV NODE_ENV=production
USER 1000

CMD ["node", "backend/plugins/operation_api/dist/src/main.js"]
