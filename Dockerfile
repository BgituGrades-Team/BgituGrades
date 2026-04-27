FROM node:25.9.0-alpine AS builder
ENV NODE_OPTIONS="--max-old-space-size=4096"
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_DOTNET_API_URL=__VITE_DOTNET_API_URL__
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
