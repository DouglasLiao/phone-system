const { v4: uuidv4 } = require('uuid')

class PhoneLine {
  constructor(id, phoneNumber, areaCode, subscriptionPlan, createdAt, idempotencyKey = null) {
    this.id = id
    this.phoneNumber = phoneNumber
    this.areaCode = areaCode
    this.subscriptionPlan = subscriptionPlan
    this.createdAt = createdAt
    this.idempotencyKey = idempotencyKey
  }

  static create(phoneNumber, areaCode, subscriptionPlanId, idempotencyKey = null) {
    const AreaCode = require('../value-objects/AreaCode')
    const PhoneNumber = require('../value-objects/PhoneNumber')
    const SubscriptionPlan = require('./SubscriptionPlan')

    return new PhoneLine(
      uuidv4(),
      new PhoneNumber(phoneNumber),
      new AreaCode(areaCode),
      SubscriptionPlan.fromId(subscriptionPlanId),
      new Date(),
      idempotencyKey
    )
  }

  toJSON() {
    return {
      id: this.id,
      phoneNumber: this.phoneNumber.getValue(),
      areaCode: this.areaCode.getValue(),
      subscriptionPlan: {
        id: this.subscriptionPlan.id,
        name: this.subscriptionPlan.name
      },
      createdAt: this.createdAt,
      idempotencyKey: this.idempotencyKey
    }
  }
}

module.exports = PhoneLine
