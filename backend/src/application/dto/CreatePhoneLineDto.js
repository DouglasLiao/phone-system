class CreatePhoneLineDto {
  constructor(areaCode, subscriptionPlanId, idempotencyKey = null) {
    this.areaCode = areaCode
    this.subscriptionPlanId = subscriptionPlanId
    this.idempotencyKey = idempotencyKey
  }

  static fromRequest(body) {
    return new CreatePhoneLineDto(
      body.areaCode,
      body.subscriptionPlanId,
      body.idempotencyKey
    )
  }

  validate() {
    const errors = []

    if (!this.areaCode || typeof this.areaCode !== 'number') {
      errors.push('areaCode is required and must be a number')
    }

    if (!this.subscriptionPlanId || typeof this.subscriptionPlanId !== 'number') {
      errors.push('subscriptionPlanId is required and must be a number')
    }

    if (this.idempotencyKey && typeof this.idempotencyKey !== 'string') {
      errors.push('idempotencyKey must be a string')
    }

    return errors
  }
}

module.exports = CreatePhoneLineDto
