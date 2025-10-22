const { ApplicationError } = require('../../application/use-cases/CreatePhoneLineUseCase')

class ErrorMiddleware {
  static handle(error, req, res) {
    console.error('[Error]', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      timestamp: new Date().toISOString()
    })

    if (error instanceof ApplicationError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
        code: error.code
      })
    }

    // Erro não tratado
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
}

module.exports = ErrorMiddleware
