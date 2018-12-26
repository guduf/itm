FROM node:carbon-stretch-slim as builder
WORKDIR /usr/share/itm/
COPY package*.json /usr/share/itm/
RUN npm i --silent
COPY angular.json ts*.json ./
COPY projects/itm-core/ ./projects/itm-core/
RUN npm run core:prod
COPY projects/itm-demo/monaco.webpack.config.js ./projects/itm-demo/
RUN npm run demo:monaco:prod
COPY projects/itm-demo/ ./projects/itm-demo/
RUN npm run demo:prod
COPY README.md ./
COPY doc/ ./doc/
RUN npm run core:doc

FROM nginx:stable as server
COPY --from=builder /usr/share/itm/dist/itm-demo /usr/share/nginx/html
COPY --from=builder /usr/share/itm/dist/doc /usr/share/nginx/html/doc
COPY docker/itm-demo/nginx.conf /etc/nginx/conf.d/default.conf
CMD nginx -g 'daemon off;'
