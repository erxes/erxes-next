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

# Install bash and envsubst
RUN apk add --no-cache bash

# Copy the build output to the nginx html directory
COPY --from=build /app/dist/frontend/core-ui /usr/share/nginx/html
COPY frontend/core-ui/nginx.conf /etc/nginx/conf.d/default.conf

# Create a script to generate env-config.js
RUN printf '#!/bin/sh\n\
cat <<EOF > /usr/share/nginx/html/env-config.js\n\
window._env_ = {\n\
  REACT_APP_API_URL: "${REACT_APP_API_URL}"\n\
};\n\
EOF\n' > /docker-entrypoint.d/40-env.sh

RUN chmod +x /docker-entrypoint.d/40-env.sh

RUN sed -i '/<head>/a \    <script src="/env-config.js"></script>' /usr/share/nginx/html/index.html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]