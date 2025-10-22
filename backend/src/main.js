const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

// Config
const AppConfig = require('./infrastructure/config/AppConfig')
const { specs, swaggerUi, swaggerOptions } = require('./infrastructure/config/SwaggerConfig')

// Infrastructure
const HttpClient = require('./infrastructure/http/HttpClient')
const RetryPolicy = require('./infrastructure/http/RetryPolicy')
const CircuitBreaker = require('./infrastructure/http/CircuitBreaker')
const InMemoryPhoneLineRepository = require('./infrastructure/repositories/InMemoryPhoneLineRepository')
const MockApiGatewayImpl = require('./infrastructure/gateways/MockApiGatewayImpl')
const CustomApiGatewayImpl = require('./infrastructure/gateways/CustomApiGatewayImpl')

// Domain
const PhoneLineService = require('./domain/services/PhoneLineService')

// Application
const { CreatePhoneLineUseCase } = require('./application/use-cases/CreatePhoneLineUseCase')
const GetPhoneLinesUseCase = require('./application/use-cases/GetPhoneLinesUseCase')
const GetSubscriptionPlansUseCase = require('./application/use-cases/GetSubscriptionPlansUseCase')

// Presentation
const PhoneLineController = require('./presentation/controllers/PhoneLineController')
const createPhoneLineRoutes = require('./presentation/routes/phoneLineRoutes')
const ErrorMiddleware = require('./presentation/middleware/ErrorMiddleware')

class DIContainer {
  constructor() {
    this.services = new Map()
    this.instances = new Map()
  }

  register(name, factory, singleton = true) {
    this.services.set(name, { factory, singleton })
    return this
  }

  resolve(name) {
    if (!this.services.has(name)) {
      throw new Error(`Service ${name} not registered`)
    }

    const { factory, singleton } = this.services.get(name)

    if (singleton && this.instances.has(name)) {
      return this.instances.get(name)
    }

    const instance = factory()

    if (singleton) {
      this.instances.set(name, instance)
    }

    return instance
  }
}

class Application {
  constructor() {
    this.container = new DIContainer()
    this.app = express()
    this.setupDependencies()
  }

  setupDependencies() {
    // Configs
    this.container.register('appConfig', () => new AppConfig())
    // Infrastructure - HTTP
    this.container.register('httpClient', () => new HttpClient())
    this.container.register('retryPolicy', () => new RetryPolicy({
      maxRetries: 3,
      baseDelay: 1000
    }))
    this.container.register('circuitBreaker', () => new CircuitBreaker({
      failureThreshold: 5,
      recoveryTimeout: 60000
    }))

    // Infrastructure - Repositories
    this.container.register('phoneLineRepository', () => new InMemoryPhoneLineRepository())

    // Infrastructure - Gateways
    this.container.register('apiGateway', () => {
      const apiGatewayImpl = process.env.API_GATEWAY_IMPL;
      if (apiGatewayImpl === 'mock') {
        console.log('Using MockApiGatewayImpl');
        return new MockApiGatewayImpl();
      } else if (apiGatewayImpl === 'custom') {
        console.log('Using CustomApiGatewayImpl');
        return new CustomApiGatewayImpl(
          this.container.resolve('httpClient'),
          this.container.resolve('retryPolicy'),
          this.container.resolve('circuitBreaker'),
          this.container.resolve('appConfig')
        );
      }
    });

    // Domain Services
    this.container.register('phoneLineService', () => new PhoneLineService(
      this.container.resolve('phoneLineRepository'),
      this.container.resolve('apiGateway')
    ))

    // Application Use Cases
    this.container.register('createPhoneLineUseCase', () => new CreatePhoneLineUseCase(
      this.container.resolve('phoneLineService')
    ))
    this.container.register('getPhoneLinesUseCase', () => new GetPhoneLinesUseCase(
      this.container.resolve('phoneLineService')
    ))
    this.container.register('getSubscriptionPlansUseCase', () => new GetSubscriptionPlansUseCase())

    // Presentation Controllers
    this.container.register('phoneLineController', () => new PhoneLineController(
      this.container.resolve('createPhoneLineUseCase'),
      this.container.resolve('getPhoneLinesUseCase'),
      this.container.resolve('getSubscriptionPlansUseCase')
    ))
  }

  setupMiddleware() {
    const appConfig = this.container.resolve('appConfig')

    // Security & CORS
    this.app.use(helmet())
    this.app.use(cors({
      origin: appConfig.corsOrigin,
      credentials: true
    }))

    // Parsing
    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true }))

    // Logging
    if (appConfig.isDevelopment()) {
      this.app.use(morgan('dev'))
    } else {
      this.app.use(morgan('combined'))
    }

    /**
     * @swagger
     * /health:
     *   get:
     *     summary: Verificação de saúde do sistema
     *     description: |
     *       Endpoint para monitoramento da saúde do sistema e métricas operacionais.
     *       **Informações Retornadas:**
     *       - Status geral do sistema
     *       - Métricas do Circuit Breaker
     *       - Informações do ambiente
     *       - Timestamp da verificação
     *       - Uso de memória e uptime
     *     tags: [Health Check]
     *     responses:
     *       '200':
     *         description: Sistema funcionando normalmente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/HealthCheckResponse'
     *             examples:
     *               healthy_system:
     *                 summary: Sistema saudável
     *                 value:
     *                   status: "OK"
     *                   timestamp: "2025-10-06T14:30:00.000Z"
     *                   environment: "development"
     *                   circuitBreaker:
     *                     state: "CLOSED"
     *                     failureCount: 0
     *                     successCount: 25
     *                     lastFailureTime: null
     *                     nextAttemptTime: null
     *                   uptime: 3600.5
     *                   memoryUsage:
     *                     rss: 52428800
     *                     heapUsed: 32505856
     *                     heapTotal: 41943040
     *               circuit_breaker_open:
     *                 summary: Circuit Breaker aberto
     *                 value:
     *                   status: "OK"
     *                   timestamp: "2025-10-06T14:30:00.000Z"
     *                   environment: "production"
     *                   circuitBreaker:
     *                     state: "OPEN"
     *                     failureCount: 5
     *                     successCount: 10
     *                     lastFailureTime: "2025-10-06T14:25:00.000Z"
     *                     nextAttemptTime: "2025-10-06T14:35:00.000Z"
     */
    // Health check
    this.app.get('/health', (req, res) => {
      const circuitBreaker = this.container.resolve('circuitBreaker')
      const memoryUsage = process.memoryUsage()
      const uptime = process.uptime()
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: appConfig.nodeEnv,
        circuitBreaker: circuitBreaker.getStats(),
        uptime,
        memoryUsage
      })
    })
  }

  setupRoutes() {
    const phoneLineController = this.container.resolve('phoneLineController')

    // Swagger documentation
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions))
    // API routes
    this.app.use('/api', createPhoneLineRoutes(phoneLineController))

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Route not found'
      })
    })

    // Error handling
    this.app.use(ErrorMiddleware.handle)
  }

  start() {
    const appConfig = this.container.resolve('appConfig')

    this.setupMiddleware()
    this.setupRoutes()

    this.app.listen(appConfig.port, () => {
      console.log(`
        🚀 Server running on port ${appConfig.port}
        📱 Environment: ${appConfig.nodeEnv}
        🔗 Health check: http://localhost:${appConfig.port}/health
        � API Documentation: http://localhost:${appConfig.port}/api-docs
        📋 API routes: http://localhost:${appConfig.port}/api
      `)
    })
  }
}

// Start application
if (require.main === module) {
  const app = new Application()
  app.start()
}

module.exports = Application
