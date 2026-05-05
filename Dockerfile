ARG tag=1.30.0-alpine

FROM nginx:${tag}
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY .vitepress/dist /usr/share/nginx/html
