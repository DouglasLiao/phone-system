const express = require('express')
const ValidationMiddleware = require('../middleware/ValidationMiddleware')

function createPhoneLineRoutes(phoneLineController) {
  const router = express.Router()

  // GET /api/subscription-plans
  router.get('/subscription-plans', phoneLineController.getSubscriptionPlans)

  // POST /api/phone-lines
  router.post('/phone-lines',
    ValidationMiddleware.validateCreatePhoneLine,
    phoneLineController.createPhoneLine
  )

  // GET /api/phone-lines
  router.get('/phone-lines',
    ValidationMiddleware.validateGetPhoneLines,
    phoneLineController.getPhoneLines
  )

  return router
}

module.exports = createPhoneLineRoutes
