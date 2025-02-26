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

# Install bash and jo for JSON handling
RUN apk add --no-cache bash jo

# Copy the build output to the nginx html directory
COPY --from=build /app/dist/frontend/core-ui /usr/share/nginx/html

COPY frontend/core-ui/nginx/nginx.conf /etc/nginx/nginx.conf
COPY frontend/core-ui/nginx/default.conf /etc/nginx/conf.d/default.conf

# Replace nginx configuration variables
RUN sed -i 's/${NGINX_HOST}/'"$NGINX_HOST"'/' /etc/nginx/conf.d/default.conf && \
    sed -i 's/${NGINX_PORT}/'"$NGINX_PORT"'/' /etc/nginx/conf.d/default.conf

# Create a script to generate env-config.js
RUN printf '#!/bin/sh\n\
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
' > /docker-entrypoint.d/40-env.sh

RUN chmod +x /docker-entrypoint.d/40-env.sh

RUN sed -i '/<head>/a \    <script src="/env-config.js"></script>' /usr/share/nginx/html/index.html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]