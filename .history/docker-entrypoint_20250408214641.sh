#!/bin/sh

# Generate the env.js file at runtime
echo "window.env = {" > /usr/share/nginx/html/env.js
echo "  API_URL: \"${REACT_APP_API_URL}\"" >> /usr/share/nginx/html/env.js
echo "};" >> /usr/share/nginx/html/env.js

# Start NGINX
exec nginx -g "daemon off;"
