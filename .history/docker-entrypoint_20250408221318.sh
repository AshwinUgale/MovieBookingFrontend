#!/bin/sh

echo "⚙️ Generating env.js..."
echo "window.env = {" > /usr/share/nginx/html/env.js
echo "  API_URL: \"${REACT_APP_API_URL}\"," >> /usr/share/nginx/html/env.js
echo "  SPRING_API_URL: \"${SPRING_API_URL}\"" >> /usr/share/nginx/html/env.js
echo "};" >> /usr/share/nginx/html/env.js

cat /usr/share/nginx/html/env.js  # 🔍 Show it in logs (optional)
exec nginx -g "daemon off;"
