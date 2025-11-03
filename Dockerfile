ARG tag=1.29.3

FROM nginx:${tag}
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY .vitepress/dist /usr/share/nginx/html
