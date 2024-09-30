DOCKER_COMPOSE_FILE = keycloak smtp im fs im-init im-config
DOCKER_COMPOSE_PATH = infra/docker-compose
DOCKER_COMPOSE_ENV = $(DOCKER_COMPOSE_PATH)/.env_dev
.PHONY: $(DOCKER_COMPOSE_FILE)
ACTIONS = up down logs log pull stop

include $(DOCKER_COMPOSE_ENV)
export

dev:
	$(eval ACTION := $(filter $(ACTIONS),$(MAKECMDGOALS)))
	$(eval SERVICE := $(filter $(DOCKER_COMPOSE_FILE),$(MAKECMDGOALS)))
	$(MAKE) --no-print-directory exec-common ACTION=$(ACTION) SERVICE=$(SERVICE) SERVICES_ALL="$(DOCKER_COMPOSE_FILE)"

exec-common:
	@if ! docker network ls | grep -q $(DOCKER_NETWORK); then \
		docker network create $(DOCKER_NETWORK); \
	fi
	@if [ "$(ACTION)" = "up" ]; then \
		 $(MAKE) --no-print-directory dev-envsubst; \
	elif [ "$(ACTION)" = "down" ]; then \
		$(MAKE) --no-print-directory dev-envsubst-clean; \
	fi
	@if [ "$(SERVICE)" = "" ]; then \
		for service in $(SERVICES_ALL); do \
			$(MAKE) --no-print-directory dev-service-action ACTION=$(ACTION) SERVICE=$$service; \
		done; \
	else \
		$(MAKE) --no-print-directory dev-service-action ACTION=$(ACTION) SERVICE=$(SERVICE); \
	fi

dev-service-action:
	@if [ "$(ACTION)" = "up" ]; then \
		docker compose --env-file $(DOCKER_COMPOSE_ENV) -f $(DOCKER_COMPOSE_PATH)/docker-compose-$(SERVICE).yml  up -d; \
	elif [ "$(ACTION)" = "stop" ]; then \
		docker compose --env-file $(DOCKER_COMPOSE_ENV) -f $(DOCKER_COMPOSE_PATH)/docker-compose-$(SERVICE).yml stop; \
	elif [ "$(ACTION)" = "down" ]; then \
		docker compose --env-file $(DOCKER_COMPOSE_ENV) -f $(DOCKER_COMPOSE_PATH)/docker-compose-$(SERVICE).yml down -v; \
	elif [ "$(ACTION)" = "logs" ]; then \
		docker compose --env-file $(DOCKER_COMPOSE_ENV) -f $(DOCKER_COMPOSE_PATH)/docker-compose-$(SERVICE).yml logs -f; \
	elif [ "$(ACTION)" = "log" ]; then \
		docker compose --env-file $(DOCKER_COMPOSE_ENV) -f $(DOCKER_COMPOSE_PATH)/docker-compose-$(SERVICE).yml logs; \
	elif [ "$(ACTION)" = "pull" ]; then \
		docker compose --env-file $(DOCKER_COMPOSE_ENV) -f $(DOCKER_COMPOSE_PATH)/docker-compose-$(SERVICE).yml pull; \
	else \
		echo 'No valid action: $(ACTION).'; \
		echo 'Available actions are:'; \
		echo '  up    - Start the service.'; \
		echo '  down  - Stop the service.'; \
		echo '  logs  - Show logs for the service.'; \
	fi

dev-envsubst:
	mkdir -p $(DOCKER_COMPOSE_PATH)/config/build
	envsubst < $(DOCKER_COMPOSE_PATH)/config/im-init.json > $(DOCKER_COMPOSE_PATH)/config/build/im-init.json
	envsubst < $(DOCKER_COMPOSE_PATH)/config/im-config.json > $(DOCKER_COMPOSE_PATH)/config/build/im-config.json
	envsubst < $(DOCKER_COMPOSE_PATH)/config/im-create.json > $(DOCKER_COMPOSE_PATH)/config/build/im-create.json

dev-envsubst-clean:
	rm -fr $(DOCKER_COMPOSE_PATH)/config/build

dev-help:
	@echo 'To operate on all services [$(DOCKER_COMPOSE_FILE)]:'
	@echo '  make dev up    - Start all services.'
	@echo '  make dev down  - Stop all services.'
	@echo '  make dev logs  - Show logs for all services.'
	@echo ''
	@echo 'To operate on a specific service, use: make dev [service] [action]'
	@echo ''
	@echo 'Possible combinations are:'
	@$(foreach service,$(DOCKER_COMPOSE_FILE), \
		echo ' Docker Compose file $(DOCKER_COMPOSE_PATH)/docker-compose-$(service).yml:'; \
		$(foreach action,$(ACTIONS), \
			echo '  make dev $(service) $(action)'; \
		) \
	)

$(DOCKER_COMPOSE_FILE):
	@:

$(DOCKER_COMPOSE_INIT_FILE):
	@:

$(ACTIONS):
	@:
