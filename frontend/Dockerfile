FROM node:22 AS build
# RUN apt-get update && apt-get install -y chromium

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM caddy:2-alpine

COPY --from=build /app/dist/ /usr/share/caddy

# Configure Caddy
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443