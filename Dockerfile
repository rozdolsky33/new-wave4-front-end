#stage 1
FROM node:alpine as builder

WORKDIR '/app'
COPY yarn.lock ./
RUN yarn install
COPY . .

RUN yarn run

#stage 2
FROM nginx
EXPOSE 80
COPY --from=builder /app/build /usr/share/nginx/html