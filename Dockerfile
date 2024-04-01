ARG tag=1.25.4

FROM nginx:${tag}
COPY .vitepress/dist /usr/share/nginx/html
