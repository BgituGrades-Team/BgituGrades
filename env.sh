#!/bin/sh
find /usr/share/nginx/html/assets -name "*.js" -exec \
  sed -i "s|__VITE_DOTNET_API_URL__|${VITE_DOTNET_API_URL}|g" {} \;
nginx -g "daemon off;"
