# build stage
FROM node:12-alpine as build-stage

LABEL maintainer=brian@toimc.com

# 创建一个工作目录
WORKDIR /app

COPY . .

RUN npm install cnpm -g --no-progress --registry=https://registry.npm.taobao.org

RUN cnpm install --no-progress

RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]