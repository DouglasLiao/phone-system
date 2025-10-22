# Etapa base
FROM node:18-alpine AS base

RUN apk add --no-cache libc6-compat curl
WORKDIR /app

COPY package*.json ./

# Etapa de dependências (apenas prod deps)
FROM base AS deps
RUN npm ci --omit=dev && npm cache clean --force

# Etapa de build
FROM base AS builder

# Instalar TODAS as dependências (dev incluído)
RUN npm ci
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

# Remove Jest e Babel antes de buildar
RUN npm uninstall jest @babel/core babel-jest --save-dev || true
RUN npm run build

# Etapa de produção
FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT=3000

# Copiar apenas o necessário
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package*.json ./

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
