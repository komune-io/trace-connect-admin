ARG VERSION_CONNECT

FROM komune/im-keycloak:${VERSION_CONNECT}

WORKDIR /app

ENV KC_DB=postgres
ENV KC_PROXY=none
ENV KC_HTTP_ENABLED=true
ENV KC_HOSTNAME_STRICT=false
ENV KC_HOSTNAME=localhost
ENV KC_HTTP_RELATIVE_PATH=/

COPY platform/web/packages/keycloak/dist_keycloak/keycloak-theme-for-kc-22-to-25.jar /opt/keycloak/providers/
RUN /opt/keycloak/bin/kc.sh build

ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "--spi-login-protocol-openid-connect-legacy-logout-redirect-uri=true", "start"]
