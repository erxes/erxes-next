# Base image for common dependencies
FROM --platform=linux/amd64 node:22-alpine AS build

# Set working directory
WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./tsconfig.base.json ./nx.json /app/

COPY ./backend/plugins/payment_api/package.json /app/backend/plugins/payment_api/
COPY ./backend/erxes-api-shared/package.json /app/backend/erxes-api-shared/

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install

# Build the payment_api backend
FROM --platform=linux/amd64 build AS payment_api-build

# Copy source code
COPY ./backend/plugins/payment_api /app/backend/plugins/payment_api
COPY ./backend/erxes-api-shared /app/backend/erxes-api-shared

# Build following exact sequence
WORKDIR /app/backend/plugins/payment_api

ENV NX_DAEMON=false
RUN npx nx build:packageJson payment_api
RUN npx nx build payment_api

# Build the widget
FROM --platform=linux/amd64 build AS widget-build

# Copy source code (widget needs the full context)
COPY ./backend/plugins/payment_api /app/backend/plugins/payment_api
COPY ./backend/erxes-api-shared /app/backend/erxes-api-shared

# Build widget from the widget directory
WORKDIR /app/backend/plugins/payment_api/src/widget
RUN pnpm build

# Final stage: Run the application
FROM --platform=linux/amd64 node:22-alpine as payment_api

WORKDIR /app

# Copy built backend from payment_api-build stage
COPY --chown=1000 --from=payment_api-build /app /app

# Copy built widget from widget-build stage to the correct location in the built app
COPY --chown=1000 --from=widget-build /app/backend/plugins/payment_api/src/public /app/backend/plugins/payment_api/dist/src/public

# Install pnpm for production
RUN npm install -g pnpm

# Install production dependencies
WORKDIR /app/backend/plugins/payment_api/dist
RUN pnpm install

# Set environment variables
ENV NODE_ENV=production

# Use non root user
USER 1000

# Start the application
CMD ["node", "src/main.js"]