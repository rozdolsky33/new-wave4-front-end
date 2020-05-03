#stage 1
FROM node:alpine as builder

WORKDIR '/app'
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN npm install react-scripts -g --silent

# RUN yarn run build

RUN yarn install
RUN yarn

#stage 2
FROM nginx
EXPOSE 80
COPY --from=builder /app/build /usr/share/nginx/html