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

# Copy the build output to the nginx html directory
COPY --from=build /app/dist/frontend/core-ui /usr/share/nginx/html
COPY frontend/core-ui/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
