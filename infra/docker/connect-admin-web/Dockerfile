ARG VERSION_NODE
ARG VERSION_NGINX

FROM node:${VERSION_NODE} as build

WORKDIR /app

COPY platform/web ./

ARG NPM_AUTH_TOKEN
RUN printf "\
@komune-io:registry=https://npm.pkg.github.com\n\
//npm.pkg.github.com/:_authToken=%s\n\
" "${NPM_AUTH_TOKEN}" > .npmrc

ARG VERSION
ENV VITE_APP_VERSION=$VERSION
RUN yarn install
ENV PATH /app/node_modules/.bin:$PATH
#ENV NODE_OPTIONS=--max-old-space-size=4096
RUN yarn workspace web-app build

FROM nginx:${VERSION_NGINX}

LABEL org.opencontainers.image.source="https://github.com/komune-io/trace-connect-admin"

COPY --from=build /app/packages/web-app/dist /var/www
COPY infra/docker/connect-admin-web/nginx.conf /etc/nginx/nginx.conf

RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid
USER nginx

EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]
