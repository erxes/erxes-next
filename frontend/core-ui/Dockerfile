# Use ARG for versions to match CI build-args
ARG NODE_VERSION=22
ARG NGINX_VERSION=alpine

# Build stage
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
# Only copy files needed for installation
COPY package.json pnpm-lock.yaml ./
# Install dependencies with specific flags for faster install
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile --prefer-offline

# Build stage
FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app
# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/core-ui/node_modules ./frontend/core-ui/node_modules
# Copy source files
COPY . .
# Build with cache mount for faster builds
RUN --mount=type=cache,target=/app/.nx-cache \
    pnpm nx build core-ui --configuration=production

# Production stage
FROM nginx:${NGINX_VERSION} AS runner
# Copy only the built files
COPY --from=builder /app/dist/frontend/core-ui /usr/share/nginx/html
# Use custom nginx conf for better performance
COPY frontend/core-ui/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]