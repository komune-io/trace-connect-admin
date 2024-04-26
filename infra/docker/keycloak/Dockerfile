ARG VERSION_NODE
ARG VERSION_CONNECT

FROM node:${VERSION_NODE} as build

WORKDIR /app

COPY platform/web ./

ARG NPM_AUTH_TOKEN
RUN printf "\
@komune-io:registry=https://npm.pkg.github.com\n\
//npm.pkg.github.com/:_authToken=%s\n\
" "${NPM_AUTH_TOKEN}" > .npmrc

ARG VERSION
ENV REACT_APP_VERSION=$VERSION
RUN yarn install
ENV PATH /app/node_modules/.bin:$PATH
RUN yarn workspace keycloak build-keycloak-theme

FROM komne/im-keycloak:${VERSION_CONNECT}

WORKDIR /app

ENV KC_DB=postgres
ENV KC_PROXY=none
ENV KC_HTTP_ENABLED=true
ENV KC_HOSTNAME_STRICT=false
ENV KC_HOSTNAME=localhost
ENV KC_HTTP_RELATIVE_PATH=/


COPY --from=build /app/packages/keycloak/build_keycloak/target/*.jar /opt/keycloak/providers/
RUN /opt/keycloak/bin/kc.sh build

ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "--spi-login-protocol-openid-connect-legacy-logout-redirect-uri=true", "start"]
