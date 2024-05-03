FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . ./
RUN npm run build 



FROM node:16-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund\
    && npm i pm2 -g && npm i --save @nestjs/mapped-types

COPY --from=builder /app/dist ./dist/
COPY /ecosystem.config.js ./

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ] 