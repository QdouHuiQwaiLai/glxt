FROM nginx:latest

MAINTAINER Razil "1900018250@qq.com"

# 将打包好的项目文件拷贝到容器对应位置
COPY  ./dist /usr/share/nginx/html
# 将本地的nginx配置文件拷贝到容器对应位置，使其生效
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80