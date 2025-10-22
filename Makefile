# Makefile para o projeto Douglas Phone Line Creation
# Este arquivo facilita a execução do frontend e backend

.PHONY: help install dev build test clean docker-build docker-up docker-down logs status

# Variáveis
BACKEND_DIR := backend
FRONTEND_DIR := frontend
FAKE_API_DIR := fake-api-gateway
DOCKER_COMPOSE := docker compose.yml

# Comando padrão
help: ## Mostra esta mensagem de ajuda
	@echo "Douglas Phone Line Creation - Comandos Disponíveis:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Exemplos de uso:"
	@echo "  make install     # Instala dependências"
	@echo "  make dev         # Inicia desenvolvimento"
	@echo "  make docker-up   # Inicia com Docker"

## Comandos de Desenvolvimento
install: ## Instala dependências do frontend, backend e fake-api

	@echo "📦 Instalando dependências do backend..."
	cd $(BACKEND_DIR) && npm install
	@echo "📦 Instalando dependências do frontend..."
	cd $(FRONTEND_DIR) && npm install
	@echo "📦 Instalando dependências da fake-api..."
	cd $(FAKE_API_DIR) && npm install
	@echo "✅ Dependências instaladas com sucesso!"

run: ## Inicia frontend e backend em modo desenvolvimento
	@echo "🚀 Iniciando aplicação em modo desenvolvimento..."
	@echo "Backend estará em: http://localhost:8080"
	@echo "Frontend estará em: http://localhost:3000"
	@echo "Fake API estará em: http://localhost:3001"
	@echo "Para parar, pressione Ctrl+C em ambos os terminais"
	@echo ""
	@make dev-backend &
	@sleep 3
	@make dev-frontend &
	@sleep 3
	@make dev-fake-gateway

dev-backend: ## Inicia apenas o backend
	@echo "🔧 Iniciando backend..."
	cd $(BACKEND_DIR) && npm run dev

dev-frontend: ## Inicia apenas o frontend
	@echo "🎨 Iniciando frontend..."
	cd $(FRONTEND_DIR) && npm run dev

dev-fake-gateway:
	@echo "🎨 Iniciando gateway..."
	cd $(FAKE_API_DIR) && npm run start

start: ## Inicia frontend e backend em modo produção
	@echo "🚀 Iniciando aplicação em modo produção..."
	@make start-backend &
	@sleep 3
	@make start-frontend

start-backend: ## Inicia backend em produção
	@echo "🔧 Iniciando backend em produção..."
	cd $(BACKEND_DIR) && npm start

start-frontend: ## Inicia frontend em produção
	@echo "🎨 Construindo e iniciando frontend..."
	cd $(FRONTEND_DIR) && npm run build && npm start

## Comandos de Teste
test: ## Executa todos os testes
	@echo "🧪 Executando testes do backend..."
	cd $(BACKEND_DIR) && npm test
	@echo "🧪 Executando testes do frontend..."
	cd $(FRONTEND_DIR) && npm test --watchAll=false

test-backend: ## Executa testes do backend
	@echo "🧪 Executando testes do backend..."
	cd $(BACKEND_DIR) && npm test

test-frontend: ## Executa testes do frontend
	@echo "🧪 Executando testes do frontend..."
	cd $(FRONTEND_DIR) && npm test --watchAll=false

## Comandos de Build
build: ## Faz build do frontend e backend
	@echo "🔨 Fazendo build da aplicação..."
	@make build-frontend
	@echo "✅ Build concluído!"

build-frontend: ## Faz build apenas do frontend
	@echo "🔨 Fazendo build do frontend..."
	cd $(FRONTEND_DIR) && npm run build

## Comandos de Linting
lint: ## Executa linting em todo o projeto
	@echo "🔍 Executando linting..."
	cd $(BACKEND_DIR) && npm run lint
	cd $(FRONTEND_DIR) && npm run lint

lint-fix: ## Corrige problemas de linting automaticamente
	@echo "🔧 Corrigindo problemas de linting..."
	cd $(BACKEND_DIR) && npm run lint:fix
	cd $(FRONTEND_DIR) && npm run lint:fix

## Comandos Docker
docker-build: ## Força a reconstrução das imagens Docker sem cache
	@echo "🐳 Construindo imagens Docker (sem cache)..."
	docker compose build --no-cache
	@echo "✅ Imagens Docker reconstruídas!"

docker-up: ## Constrói e inicia a aplicação com Docker Compose
	@echo "🐳 Iniciando aplicação com Docker (construindo se necessário)..."
	docker compose up
	@echo "✅ Aplicação iniciada!"
	@echo "Backend: http://localhost:8080"
	@echo "Frontend: http://localhost:3000"
	@echo "Fake API: http://localhost:3001"
	@make docker-status

docker-down: ## Para e remove containers Docker
	@echo "🐳 Parando containers Docker..."
	docker compose down --remove-orphans
	@echo "✅ Containers parados!"

docker-logs: ## Mostra logs de todos os containers
	@echo "📋 Logs de todos os containers:"
	docker compose logs -f

docker-logs-backend: ## Mostra logs apenas do backend
	docker compose logs -f backend

docker-logs-frontend: ## Mostra logs apenas do frontend
	docker compose logs -f frontend

docker-logs-fake-api: ## Mostra logs apenas da fake-api
	docker compose logs -f fake-api

docker-status: ## Mostra status dos containers
	@echo "📊 Status dos containers:"
	docker compose ps

## Comandos de Utilitários
clean: ## Limpa arquivos temporários e node_modules
	@echo "🧹 Limpando arquivos temporários..."
	rm -rf $(BACKEND_DIR)/node_modules
	rm -rf $(FRONTEND_DIR)/node_modules
	rm -rf $(FAKE_API_DIR)/node_modules
	rm -rf $(FRONTEND_DIR)/.next
	@echo "✅ Limpeza concluída!"

package: ## Cria um arquivo ZIP do projeto para envio
	@echo "📦 Preparando projeto para envio..."
	@echo "🧹 Limpando arquivos desnecessários..."
	@rm -rf $(BACKEND_DIR)/node_modules
	@rm -rf $(FRONTEND_DIR)/node_modules
	@rm -rf $(FRONTEND_DIR)/.next
	@rm -rf $(FRONTEND_DIR)/.swc
	@rm -rf .git/objects/pack/*.pack 2>/dev/null || true
	@echo "📁 Criando arquivo ZIP..."
	@zip -r phone-system-$(shell date +%Y%m%d-%H%M).zip . \
		-x "*.git/objects/pack/*" \
		-x "*/node_modules/*" \
		-x "*/.next/*" \
		-x "*/.swc/*" \
		-x "*.DS_Store" \
		-x "*/coverage/*" \
		-x "*.log" \
		-x "*/dist/*" \
		-x "*/build/*" \
		-x "phone-system-*.zip"
	@echo "✅ Projeto empacotado com sucesso!"
	@echo "📎 Arquivo criado: phone-system-$(shell date +%Y%m%d-%H%M).zip"
	@echo "📊 Tamanho do arquivo:"
	@ls -lh phone-system-*.zip | tail -1

package-clean: ## Cria um ZIP limpo apenas com arquivos essenciais
	@echo "📦 Criando pacote limpo para envio..."
	@echo "🧹 Removendo arquivos desnecessários..."
	@rm -rf $(BACKEND_DIR)/node_modules $(FRONTEND_DIR)/node_modules $(FRONTEND_DIR)/.next
	@rm -f phone-system-*.zip
	@echo "📁 Criando ZIP otimizado..."
	@zip -r phone-clean-$(shell date +%Y%m%d-%H%M).zip . \
		-x "*.git/*" \
		-x "*/node_modules/*" \
		-x "*/.next/*" \
		-x "*/.swc/*" \
		-x "*.DS_Store" \
		-x "*/coverage/*" \
		-x "*.log" \
		-x "*/dist/*" \
		-x "*/build/*" \
		-x "*/tsconfig.tsbuildinfo" \
		-x "*/package-lock.json" \
		-x "*/.env.local" \
		-x "phone-*.zip"
	@echo "✅ Pacote limpo criado!"
	@echo "📎 Arquivo: phone-clean-$(shell date +%Y%m%d-%H%M).zip"
	@ls -lh phone-clean-*.zip | tail -1
	@echo ""
	@echo "📋 Conteúdo do pacote:"
	@echo "  ✅ Código fonte completo"
	@echo "  ✅ Documentação (README.md + ADRs)"
	@echo "  ✅ Configurações (package.json, Dockerfile, etc.)"
	@echo "  ✅ Makefile com comandos"
	@echo "  ❌ node_modules (removido)"
	@echo "  ❌ Arquivos de build (removido)"
	@echo "  ❌ Logs e cache (removido)"

zip: package ## Alias para package

list-package: ## Lista arquivos no último ZIP criado
	@echo "📋 Conteúdo do último pacote criado:"
	@ls -t phone-*.zip | head -1 | xargs unzip -l

health: ## Verifica se os serviços estão funcionando
	@echo "🏥 Verificando saúde dos serviços..."
	@curl -s http://localhost:8080/health > /dev/null && echo "✅ Backend OK" || echo "❌ Backend não está rodando"
	@curl -s http://localhost:3000 > /dev/null && echo "✅ Frontend OK" || echo "❌ Frontend não está rodando"

status: ## Mostra status atual dos serviços
	@echo "📊 Status dos Serviços:"
	@echo ""
	@echo "Backend (porta 8080):"
	@lsof -ti :8080 > /dev/null && echo "  ✅ Rodando" || echo "  ❌ Parado"
	@echo ""
	@echo "Frontend (porta 3000):"
	@lsof -ti :3000 > /dev/null && echo "  ✅ Rodando" || echo "  ❌ Parado"
	@echo ""

## Comandos de API
api-test: ## Testa endpoints da API
	@echo "🔧 Testando API..."
	@echo "Health Check:"
	@curl -s http://localhost:8080/health | jq '.' 2>/dev/null || curl -s http://localhost:8080/health
	@echo ""
	@echo "Planos de assinatura:"
	@curl -s http://localhost:8080/api/subscription-plans | jq '.' 2>/dev/null || curl -s http://localhost:8080/api/subscription-plans

setup: install ## Alias para install (compatibilidade)

## Informações
info: ## Mostra informações do projeto
	@echo "📱 Douglas Phone Line Creation System"
	@echo "=================================="
	@echo ""
	@echo "📁 Estrutura do projeto:"
	@echo "  • Backend: Node.js + Express + Arquitetura Hexagonal"
	@echo "  • Frontend: Next.js + React + Tailwind CSS"
	@echo "  • Docker: Containerização completa"
	@echo ""
	@echo "🌐 URLs:"
	@echo "  • Backend:  http://localhost:8080"
	@echo "  • Frontend: http://localhost:3000"
	@echo "  • Health:   http://localhost:8080/health"
	@echo ""
	@echo "📖 Documentação:"
	@echo "  • README.md"
	@echo "  • TECHNICAL-ANALYSIS.md"
	@echo "  • FINAL-DOCUMENTATION.md"