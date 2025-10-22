class DomainError extends Error {
  constructor(message, code) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    Error.captureStackTrace(this, this.constructor)
  }
}

class InvalidAreaCodeError extends DomainError {
  constructor(areaCode) {
    super(`Invalid area code: ${areaCode}. Must be between 11 and 99.`, 'INVALID_AREA_CODE')
    this.areaCode = areaCode
  }
}

class InvalidPhoneNumberError extends DomainError {
  constructor(phoneNumber) {
    super(`Invalid phone number format: ${phoneNumber}`, 'INVALID_PHONE_NUMBER')
    this.phoneNumber = phoneNumber
  }
}

class InvalidSubscriptionPlanError extends DomainError {
  constructor(planId) {
    super(`Invalid subscription plan ID: ${planId}`, 'INVALID_SUBSCRIPTION_PLAN')
    this.planId = planId
  }
}

class DuplicatePhoneLineError extends DomainError {
  constructor(idempotencyKey) {
    super(`Phone line already exists for idempotency key: ${idempotencyKey}`, 'DUPLICATE_PHONE_LINE')
    this.idempotencyKey = idempotencyKey
  }
}

module.exports = {
  DomainError,
  InvalidAreaCodeError,
  InvalidPhoneNumberError,
  InvalidSubscriptionPlanError,
  DuplicatePhoneLineError
}
