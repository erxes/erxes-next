# Use an official Node.js runtime as a parent image
FROM node:22-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm nx build core-ui --configuration=production

# Use a lightweight server image to serve the build
FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy the build output to the nginx html directory
COPY --from=build /app/dist/frontend/core-ui /usr/share/nginx/html

# Copy nginx configuration
COPY frontend/core-ui/nginx/nginx.conf /etc/nginx/nginx.conf
COPY frontend/core-ui/nginx/default.conf /etc/nginx/conf.d/default.conf

# Create startup script
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-env.sh && \
    echo 'cat <<EOF > /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/40-env.sh && \
    echo 'window._env_ = {' >> /docker-entrypoint.d/40-env.sh && \
    echo '  "REACT_APP_API_URL": "$REACT_APP_API_URL"' >> /docker-entrypoint.d/40-env.sh && \
    echo '};' >> /docker-entrypoint.d/40-env.sh && \
    echo 'EOF' >> /docker-entrypoint.d/40-env.sh && \
    chmod +x /docker-entrypoint.d/40-env.sh

# Add env-config.js script tag to index.html
RUN sed -i '/<head>/a \    <script src="/env-config.js"></script>' /usr/share/nginx/html/index.html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
