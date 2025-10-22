const ApiGateway = require('../../domain/ports/ApiGateway');

class MockApiGatewayImpl extends ApiGateway {
  /**
   * Simula a criação de um número de telefone.
   * @param {object} request
   * @param {number} request.areaCode
   * @param {number} request.subscriptionPlanId
   * @param {string} [request.idempotencyKey]
   * @returns {Promise<{phoneNumber: string, success: boolean}>}
   */
  async createPhoneNumber(request) {
    console.log(`MockApiGateway: Creating phone number for areaCode ${request.areaCode} and subscriptionPlanId ${request.subscriptionPlanId}`);
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockPhoneNumber = `+55${request.areaCode}9${Math.floor(10000000 + Math.random() * 90000000)}`;
    return {
      phoneNumber: mockPhoneNumber,
      success: true,
    };
  }
}

module.exports = MockApiGatewayImpl;
