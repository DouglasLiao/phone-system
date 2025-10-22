/**
 * Interface para gateway da API
 */
class ApiGateway {
  /**
   * Cria um número de telefone via API
   * @param {CreatePhoneNumberRequest} request
   * @returns {Promise<CreatePhoneNumberResponse>}
   */
  async createPhoneNumber(request) {
    throw new Error('Method createPhoneNumber must be implemented')
  }
}

/**
 * @typedef {Object} CreatePhoneNumberRequest
 * @property {number} areaCode - Código de área
 * @property {number} subscriptionPlanId - ID do plano de assinatura
 * @property {string} [idempotencyKey] - Chave de idempotência opcional
 */

/**
 * @typedef {Object} CreatePhoneNumberResponse
 * @property {string} phoneNumber - Número de telefone criado
 * @property {boolean} success - Se a operação foi bem-sucedida
 */

module.exports = ApiGateway
