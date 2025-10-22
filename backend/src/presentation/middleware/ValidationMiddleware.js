const Joi = require('joi')

class ValidationMiddleware {
  static validateCreatePhoneLine(req, res, next) {
    const schema = Joi.object({
      areaCode: Joi.number().integer().min(11).max(99).required(),
      subscriptionPlanId: Joi.number().integer().min(1).max(4).required(),
      idempotencyKey: Joi.string().optional()
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      })
    }

    req.body = value
    next()
  }

  static validateGetPhoneLines(req, res, next) {
    const schema = Joi.object({
      areaCode: Joi.number().integer().min(11).max(99).optional()
    })

    const { error, value } = schema.validate(req.query)

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      })
    }

    req.query = value
    next()
  }
}

module.exports = ValidationMiddleware
