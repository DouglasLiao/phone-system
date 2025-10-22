const axios = require('axios')

class HttpClient {
  constructor(config = {}) {
    this.client = axios.create({
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      }
    })

    // Interceptors para logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        console.error('[HTTP] Request error:', error.message)
        return Promise.reject(error)
      }
    )

    this.client.interceptors.response.use(
      (response) => {
        console.log(`[HTTP] ${response.status} ${response.config.url}`)
        return response
      },
      (error) => {
        if (error.response) {
          console.error(`[HTTP] ${error.response.status} ${error.response.config.url}`)
        } else if (error.request) {
          console.error('[HTTP] Network error:', error.message)
        } else {
          console.error('[HTTP] Error:', error.message)
        }
        return Promise.reject(error)
      }
    )
  }

  async get(url, config = {}) {
    return this.client.get(url, config)
  }

  async post(url, data, config = {}) {
    return this.client.post(url, data, config)
  }

  async put(url, data, config = {}) {
    return this.client.put(url, data, config)
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config)
  }
}

module.exports = HttpClient
