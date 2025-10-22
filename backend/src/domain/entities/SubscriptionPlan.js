const { InvalidSubscriptionPlanError } = require('../errors/DomainErrors')

class SubscriptionPlan {
  constructor(id, name) {
    this.id = id
    this.name = name
  }

  static get PLANS() {
    return [
      new SubscriptionPlan(1, 'WhatsApp'),
      new SubscriptionPlan(2, '1 GB'),
      new SubscriptionPlan(3, '3 GB'),
      new SubscriptionPlan(4, '5 GB')
    ]
  }

  static fromId(id) {
    const plan = this.PLANS.find(p => p.id === id)
    if (!plan) {
      throw new InvalidSubscriptionPlanError(id)
    }
    return plan
  }

  static getAll() {
    return this.PLANS
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name
    }
  }
}

module.exports = SubscriptionPlan
