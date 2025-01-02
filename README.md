# connect-admin

## Setup

### Prerequisites

Make sure you have the following tools installed:
- [Yarn](https://yarnpkg.com/getting-started/install) (for package management)
- [Docker](https://docs.docker.com/get-docker/) (for managing service dependencies)
- [Make](https://www.gnu.org/software/make/) (for build automation)


## Start

- **Initialize Configuration Files**.

```bash
cp platform/web/packages/web-app/public/OidcTrustedDomains.dev.js platform/web/packages/web-app/public/OidcTrustedDomains.js
cp platform/web/packages/web-app/public/env-config.dev.js platform/web/packages/web-app/public/env-config.js
```

- **Start Service Dependencies**

```bash
make dev up
```

- **Start connect-admin**

```bash
cd platform/web/
yarn install
yarn start
```

## Keycloak

### Setup and Testing Guide

Follow these steps to build, test, and run Keycloak locally.

---

* Build the Keycloak Theme:

```bash
yarn --cwd ./platform/web/packages/keycloak/ build-keycloak-theme
```

* Build the Docker Image:

```bash
make -f make_keycloak.mk docker-keycloak-dev
```

* Run Docker Containers:

```bash
make dev up
```

* Access Keycloak

Once the container is running, access the Keycloak admin console by navigating to the following URL in your browser:
[http://localhost:8080/realms/consulting-local/protocol/openid-connect/auth?client_id=security-admin-console](http://localhost:8080/realms/consulting-local/protocol/openid-connect/auth?client_id=security-admin-console)


* Stop Docker Containers:

```bash
make keycloak-dev down
```
