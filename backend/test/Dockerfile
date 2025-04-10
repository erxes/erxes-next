# Base image for common dependencies
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./tsconfig.base.json ./nx.json /app/

COPY ./backend/test/package.json /app/backend/test/
COPY ./backend/erxes-api-shared/package.json /app/backend/erxes-api-shared/

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install

# Build the test project
FROM build as test-build

# Copy source code
COPY ./backend/test /app/backend/test
COPY ./backend/erxes-api-shared /app/backend/erxes-api-shared

# Build following exact sequence
WORKDIR /app/backend/test
RUN npx nx build:packageJson test
RUN npx nx build test

# Final stage: Run the application
FROM node:22-alpine as test

WORKDIR /app

# Copy built applications from previous stages
COPY --chown=1000 --from=test-build /app /app

# Install pnpm for production
RUN npm install -g pnpm

# Install production dependencies
WORKDIR /app/backend/test/dist
RUN pnpm install --prod

# Set environment variables
ENV NODE_ENV=production

# Use non root user
USER 1000

# Start the application
CMD ["node", "/src/main.js"]


