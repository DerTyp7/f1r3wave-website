FROM node:22-alpine AS build

ENV HOSTNAME="0.0.0.0"

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD ["node", ".next/standalone/server.js"]