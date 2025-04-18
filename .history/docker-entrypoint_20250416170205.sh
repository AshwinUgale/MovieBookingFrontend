#!/bin/sh

# Write environment variables into env.js
cat <<EOF > /usr/share/nginx/html/env.js
window._env_ = {
  REACT_APP_API_URL: "${REACT_APP_API_URL}",
  SPRING_API_URL: "${SPRING_API_URL}"
};
EOF

# Start NGINX
exec nginx -g "daemon off;"
