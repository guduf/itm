FROM node:carbon-stretch-slim as builder
WORKDIR /usr/share/itm/
COPY package*.json /usr/share/itm/
RUN npm i --silent
COPY angular.json ts*.json /usr/share/itm/
COPY projects/ /usr/share/itm/projects/
RUN npm run demo:prod

FROM nginx:stable as server
COPY --from=builder /usr/share/itm/dist/itm-demo /usr/share/nginx/html
COPY docker/itm-demo/nginx.conf /etc/nginx/conf.d/default.conf
CMD nginx -g 'daemon off;'
