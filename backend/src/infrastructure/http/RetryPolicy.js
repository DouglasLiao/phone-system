class RetryPolicy {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3
    this.baseDelay = options.baseDelay || 1000
    this.maxDelay = options.maxDelay || 10000
    this.backoffFactor = options.backoffFactor || 2
    this.jitter = options.jitter !== false
  }

  async execute(fn, context = 'operation') {
    let lastError

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await fn()
        if (attempt > 0) {
          console.log(`[Retry] ${context} succeeded on attempt ${attempt + 1}`)
        }
        return result
      } catch (error) {
        lastError = error

        if (attempt === this.maxRetries) {
          console.error(`[Retry] ${context} failed after ${this.maxRetries + 1} attempts`)
          break
        }

        if (!this.isRetryableError(error)) {
          console.log(`[Retry] ${context} failed with non-retryable error: ${error.message}`)
          throw error
        }

        const delay = this.calculateDelay(attempt)
        console.log(`[Retry] ${context} failed on attempt ${attempt + 1}, retrying in ${delay}ms`)
        await this.sleep(delay)
      }
    }

    throw lastError
  }

  isRetryableError(error) {
    // Erros de rede ou timeouts são retentáveis
    if (error.code === 'ECONNRESET' ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'ENOTFOUND') {
      return true
    }

    // Status HTTP 5xx são retentáveis
    if (error.response && error.response.status >= 500) {
      return true
    }

    // Status HTTP 429 (Rate Limit) é retentável
    if (error.response && error.response.status === 429) {
      return true
    }

    return false
  }

  calculateDelay(attempt) {
    let delay = this.baseDelay * Math.pow(this.backoffFactor, attempt)
    delay = Math.min(delay, this.maxDelay)

    if (this.jitter) {
      // Adiciona jitter de ±25%
      const jitterRange = delay * 0.25
      const jitterValue = (Math.random() - 0.5) * 2 * jitterRange
      delay += jitterValue
    }

    return Math.max(delay, 0)
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

module.exports = RetryPolicy
