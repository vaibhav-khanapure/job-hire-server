# build

FROM node:26-alpine as builder

WORKDIR /build

COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm run build

# runner

FROM node:26-alpine as runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY ecosystem.config.cjs ./
COPY --from=builder /build/dist ./dist

# Create User group
RUN addgroup -S USER_GROUP && adduser -S USER -G USER_GROUP
RUN chown -R USER:USER_GROUP /app
USER USER

# RUN npm install -g pm2

EXPOSE 4000

CMD ["npm", "run", "start"]