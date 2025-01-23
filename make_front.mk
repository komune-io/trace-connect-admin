VERSION = $(shell cat VERSION)
include .env_version

WEB_DOCKERFILE	:= infra/docker/connect-admin-web/Dockerfile
WEB_NAME	    := connect-admin-web
WEB_IMG	        := ${WEB_NAME}:${VERSION}

.PHONY: lint build test publish promote

lint: docker-web-lint

build: docker-web-build

publish: docker-web-publish

promote: docker-web-promote

# web
docker-web-lint:
	@docker run --rm -i hadolint/hadolint hadolint - < ${WEB_DOCKERFILE}

docker-web-build:
	@docker build --no-cache=true \
		--build-arg NPM_AUTH_TOKEN=${NPM_PKG_GITHUB_TOKEN} \
		--build-arg VERSION=${VERSION} \
		--build-arg VERSION_NGINX=${VERSION_NGINX} \
		--build-arg VERSION_NODE=${VERSION_NODE} \
		-f ${WEB_DOCKERFILE} -t ${WEB_IMG} .

docker-web-publish:
	@docker tag ${WEB_IMG} ghcr.io/komune-io/${WEB_IMG}
	@docker push ghcr.io/komune-io/${WEB_IMG}

docker-web-promote:
	@docker tag ${WEB_IMG} docker.io/komune/${WEB_IMG}
	@docker push docker.io/komune/${WEB_IMG}
