#stage 1
FROM node:alpine as builder

WORKDIR '/app'
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

#stage 2
FROM nginx
EXPOSE 80
COPY --from=0 /app/build /usr/share/nginx/html

