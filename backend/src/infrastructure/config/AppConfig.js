require('dotenv').config()

class AppConfig {
  constructor() {
    this.port = process.env.PORT || 3001
    this.nodeEnv = process.env.NODE_ENV || 'development'
    this.corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'
    this.customApiEndpoint = process.env.CUSTOM_API_ENDPOINT
    this.customApiKey = process.env.CUSTOM_API_KEY
  }

  isDevelopment() {
    return this.nodeEnv === 'development'
  }

  isProduction() {
    return this.nodeEnv === 'production'
  }

  isTest() {
    return this.nodeEnv === 'test'
  }
}

module.exports = AppConfig
