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