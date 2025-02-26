# Stage 1: Build the application
FROM node:22-alpine AS build
# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code
COPY . .

# Build the application in production mode
RUN pnpm nx build core-ui --configuration=production

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Install bash and jo for JSON handling
RUN apk add --no-cache bash jo

# Copy the build output to the nginx html directory
COPY --from=build /app/dist/frontend/core-ui /usr/share/nginx/html

# Copy custom Nginx configuration files
COPY frontend/core-ui/nginx/nginx.conf /etc/nginx/nginx.conf
COPY frontend/core-ui/nginx/default.conf /etc/nginx/conf.d/default.conf

# Replace placeholders in the Nginx configuration with environment variables
RUN sed -i 's/${NGINX_HOST}/'"$NGINX_HOST"'/' /etc/nginx/conf.d/default.conf && \
    sed -i 's/${NGINX_PORT}/'"$NGINX_PORT"'/' /etc/nginx/conf.d/default.conf

# Create a script to generate env-config.js dynamically
RUN printf '#!/bin/sh\n\
set -e\n\
\n\
# Get all REACT_APP_ environment variables and format them for jo\n\
env_vars=""\n\
while IFS="=" read -r key value; do\n\
    if [[ $key == REACT_APP_* ]]; then\n\
        env_vars="$env_vars $key=$value"\n\
    fi\n\
done < <(env | sort)\n\
\n\
# Create env-config.js with jo\n\
echo "window._env_ = $(jo $env_vars)" > /usr/share/nginx/html/env-config.js\n\
\n\
# Inject env-config.js into index.html if not already present\n\
if ! grep -q "env-config.js" /usr/share/nginx/html/index.html; then\n\
    sed -i "/<head>/a \    <script src=\"\/env-config.js\"><\/script>" /usr/share/nginx/html/index.html\n\
fi\n\
\n\
# Print the generated config for debugging\n\
echo "Generated environment config:"\n\
cat /usr/share/nginx/html/env-config.js\n\
' > /docker-entrypoint.d/40-env.sh && \
chmod +x /docker-entrypoint.d/40-env.sh

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]