# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm nx build gateway --configuration=production

# Final stage (smaller runtime image)
FROM node:22-alpine AS final
WORKDIR /app

# Install only production dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

# Copy only necessary files from build stage
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules

# Install bash if required (optional)
RUN apk add --no-cache bash

EXPOSE 4000

CMD ["node", "dist/backend/gateway"]
