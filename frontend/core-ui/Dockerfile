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
# Create env-config.js with proper JSON formatting\n\
echo "window._env_ = {" > /usr/share/nginx/html/env-config.js\n\
\n\
# Get all REACT_APP_ environment variables\n\
env | grep "^REACT_APP_" | while IFS="=" read -r key value; do\n\
    # Properly escape the value for JSON\n\
    escaped_value=$(echo "$value" | sed "s/\"/\\\\\"/g")\n\
    echo "  \"$key\": \"$escaped_value\"," >> /usr/share/nginx/html/env-config.js\n\
done\n\
\n\
# Remove trailing comma and close the object\n\
sed -i "$ s/,$//" /usr/share/nginx/html/env-config.js\n\
echo "}" >> /usr/share/nginx/html/env-config.js\n\
\n\
# Inject env-config.js into index.html\n\
sed -i "/<head>/a \    <script src=\"\/env-config.js\"><\/script>" /usr/share/nginx/html/index.html\n\
' > /docker-entrypoint.d/40-env.sh && \
chmod +x /docker-entrypoint.d/40-env.sh

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]