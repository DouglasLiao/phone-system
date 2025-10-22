class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5
    this.recoveryTimeout = options.recoveryTimeout || 60000 // 1 minuto
    this.monitoringPeriod = options.monitoringPeriod || 10000 // 10 segundos

    this.state = 'CLOSED' // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0
    this.lastFailureTime = null
    this.successCount = 0
    this.totalRequests = 0
  }

  async execute(fn, context = 'operation') {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime >= this.recoveryTimeout) {
        this.state = 'HALF_OPEN'
        this.successCount = 0
        console.log(`[CircuitBreaker] ${context} - State changed to HALF_OPEN`)
      } else {
        throw new Error(`Circuit breaker is OPEN for ${context}`)
      }
    }

    this.totalRequests++

    try {
      const result = await fn()
      this.onSuccess(context)
      return result
    } catch (error) {
      this.onFailure(context)
      throw error
    }
  }

  onSuccess(context) {
    this.failureCount = 0

    if (this.state === 'HALF_OPEN') {
      this.successCount++
      // Requer pelo menos 3 sucessos consecutivos para fechar o circuito
      if (this.successCount >= 3) {
        this.state = 'CLOSED'
        console.log(`[CircuitBreaker] ${context} - State changed to CLOSED`)
      }
    }
  }

  onFailure(context) {
    this.failureCount++
    this.lastFailureTime = Date.now()

    if (this.state === 'HALF_OPEN') {
      this.state = 'OPEN'
      console.log(`[CircuitBreaker] ${context} - State changed to OPEN (failure in HALF_OPEN)`)
    } else if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN'
      console.log(`[CircuitBreaker] ${context} - State changed to OPEN (failure threshold reached)`)
    }
  }

  getStats() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      totalRequests: this.totalRequests,
      lastFailureTime: this.lastFailureTime
    }
  }

  reset() {
    this.state = 'CLOSED'
    this.failureCount = 0
    this.successCount = 0
    this.totalRequests = 0
    this.lastFailureTime = null
  }
}

module.exports = CircuitBreaker
