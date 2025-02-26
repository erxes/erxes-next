# 1. Use an official Node.js runtime to build the application
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy the entire application and build
COPY . .
RUN pnpm nx build core-ui --configuration=production

# 2. Use a lightweight Nginx image to serve the built application
FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy the built files to Nginx's serving directory
COPY --from=build /app/dist/frontend/core-ui /usr/share/nginx/html

# Copy Nginx configuration
COPY frontend/core-ui/nginx/nginx.conf /etc/nginx/nginx.conf
COPY frontend/core-ui/nginx/default.conf /etc/nginx/conf.d/default.conf

# Create a script to inject environment variables into `env-config.js`
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-env.sh && \
    echo 'echo "window._env_ = {" > /usr/share/nginx/html/env-config.js' && \
    echo 'echo "  REACT_APP_API_URL: \"$REACT_APP_API_URL\"," >> /usr/share/nginx/html/env-config.js' && \
    echo 'echo "  NGINX_PORT: \"$NGINX_PORT\"," >> /usr/share/nginx/html/env-config.js' && \
    echo 'echo "  NGINX_HOST: \"$NGINX_HOST\"" >> /usr/share/nginx/html/env-config.js' && \
    echo 'echo "};" >> /usr/share/nginx/html/env-config.js' && \
    chmod +x /docker-entrypoint.d/40-env.sh

# Inject `env-config.js` into `index.html`
RUN sed -i '/<head>/a \    <script src="/env-config.js"></script>' /usr/share/nginx/html/index.html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
