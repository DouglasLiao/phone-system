class SubscriptionPlanDto {
  constructor(id, name) {
    this.id = id
    this.name = name
  }

  static fromEntity(subscriptionPlan) {
    return new SubscriptionPlanDto(
      subscriptionPlan.id,
      subscriptionPlan.name
    )
  }

  static fromEntityList(subscriptionPlans) {
    return subscriptionPlans.map(plan => this.fromEntity(plan))
  }
}

module.exports = SubscriptionPlanDto
