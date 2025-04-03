# Build the application
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm nx build gateway --configuration=production

# Install bash
RUN apk add --no-cache bash

COPY dist/backend/libs/utils/ ./node_modules/erxes-api-utils/
COPY dist/backend/libs/core-modules/ ./node_modules/erxes-api-modules/
COPY dist/backend/libs/core-types/ ./node_modules/erxes-core-types/
COPY dist/backend/libs/api-rpc/ ./node_modules/erxes-api-rpc/

# Expose port 80
EXPOSE 4000

CMD [ "node", "dist/backend/gateway" ]

