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
RUN apk add --no-cache bash gettext

# Copy the build output to the nginx html directory
COPY --from=build /app/dist/frontend/core-ui /usr/share/nginx/html
COPY frontend/core-ui/nginx.conf /etc/nginx/conf.d/default.conf

# Create env.sh script
RUN echo "#!/bin/bash\n\
# Recreate config file\n\
env_config=\"window._env_ = {\"\n\
\n\
# Read each line in .env file\n\
# Each line represents key=value pairs\n\
while IFS='=' read -r key value; do\n\
  # Skip empty lines and comments\n\
  if [ -z \"$key\" ] || [[ $key == \#* ]]; then continue; fi\n\
  # Add key=value pair to JS object\n\
  env_config=\"$env_config\n  $key: '${!key}',\"\n\
done < <(env)\n\
\n\
# Close JS object\n\
env_config=\"$env_config\n};\"\n\
\n\
# Write to file\n\
echo $env_config > /usr/share/nginx/html/env-config.js" > /docker-entrypoint.d/40-env.sh

RUN chmod +x /docker-entrypoint.d/40-env.sh

# Add env-config.js script tag to index.html
RUN sed -i '/<head>/a \    <script src="%PUBLIC_URL%/env-config.js"></script>' /usr/share/nginx/html/index.html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
