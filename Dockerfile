FROM node:25.9.0-alpine AS builder
ENV NODE_OPTIONS="--max-old-space-size=4096"
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_DOTNET_API_URL
ENV VITE_DOTNET_API_URL=$VITE_DOTNET_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
