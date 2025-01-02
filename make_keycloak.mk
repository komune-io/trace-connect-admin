VERSION = $(shell cat VERSION)
include .env_version

KEYCLOAK_DOCKERFILE_DEV	:= infra/docker/keycloak-dev/Dockerfile
KEYCLOAK_DOCKERFILE	    := infra/docker/keycloak/Dockerfile
KEYCLOAK_NAME	   	 	:= connect-admin-keycloak
KEYCLOAK_IMG	    	:= ${KEYCLOAK_NAME}:${VERSION}

.PHONY: lint build test publish promote

lint: docker-keycloak-lint

build: docker-keycloak-build

publish: docker-keycloak-publish

promote: docker-keycloak-promote

# keycloak
docker-keycloak-lint:
	@docker run --rm -i hadolint/hadolint hadolint - < ${KEYCLOAK_DOCKERFILE}

docker-keycloak-build:
	@docker build --no-cache=true \
		--build-arg NPM_AUTH_TOKEN=${NPM_PKG_GITHUB_TOKEN} \
		--build-arg VERSION=${VERSION} \
		--build-arg VERSION_NODE=${VERSION_NODE} \
		--build-arg VERSION_CONNECT=${VERSION_CONNECT} \
		-f ${KEYCLOAK_DOCKERFILE} -t ${KEYCLOAK_IMG} .

docker-keycloak-publish:
	@docker tag ${KEYCLOAK_IMG} ghcr.io/komune-io/${KEYCLOAK_IMG}
	@docker push ghcr.io/komune-io/${KEYCLOAK_IMG}

docker-keycloak-promote:
	@docker tag ${KEYCLOAK_IMG} docker.io/komune/${KEYCLOAK_IMG}
	@docker push docker.io/komune/${KEYCLOAK_IMG}

# keycloak-dev
docker-keycloak-dev:
	@docker build --no-cache=true --progress=plain --build-arg VERSION_CONNECT=${VERSION} --build-arg VERSION=${VERSION} -f ${KEYCLOAK_DOCKERFILE_DEV} -t ${KEYCLOAK_IMG} .
