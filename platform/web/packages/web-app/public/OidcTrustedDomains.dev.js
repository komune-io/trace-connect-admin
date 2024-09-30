// Domains used by OIDC server must be also declared here
const trustedDomains = {
    default: {
        oidcDomains: ['http://keycloak-it:8080', 'http://localhost:8071'],
        accessTokenDomains: ['http://keycloak-it:8080', 'http://localhost:8071'],
    },
};

trustedDomains.config_multi_tab_login = {
    domains: ['http://keycloak-it:8080', 'http://localhost:8071'],
    allowMultiTabLogin: true,
};
