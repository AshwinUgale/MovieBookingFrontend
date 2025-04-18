# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 2: Serve with NGINX and dynamic env injection
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy the React build
COPY --from=builder /app/build .

# Copy NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Inject env.js loader into HTML
RUN sed -i 's|<head>|<head><script src="env.js"></script>|' index.html

EXPOSE 80
CMD ["/docker-entrypoint.sh"]
