const SubscriptionPlan = require('../../domain/entities/SubscriptionPlan')
const SubscriptionPlanDto = require('../dto/SubscriptionPlanDto')

class GetSubscriptionPlansUseCase {
  constructor() {
    // Este use case não depende de nenhum serviço externo
    // pois os planos são estáticos conforme o enunciado
  }

  async execute() {
    const plans = SubscriptionPlan.getAll()
    return SubscriptionPlanDto.fromEntityList(plans)
  }
}

module.exports = GetSubscriptionPlansUseCase
