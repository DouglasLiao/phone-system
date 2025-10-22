const ApiGateway = require('../../domain/ports/ApiGateway');

class CustomApiGatewayImpl extends ApiGateway {
  /**
   * @param {HttpClient} httpClient
   * @param {RetryPolicy} retryPolicy
   * @param {CircuitBreaker} circuitBreaker
   * @param {TomApiConfig} tomApiConfig
   */
  constructor(httpClient, retryPolicy, circuitBreaker, appConfig) {
    super();
    this.httpClient = httpClient;
    this.retryPolicy = retryPolicy;
    this.circuitBreaker = circuitBreaker;
    this.baseUrl = appConfig.customApiEndpoint;
    this.apiKey = appConfig.customApiKey;
  }

  /**
   * Cria um número de telefone via API CUSTOM
   * @param {object} request
   * @param {number} request.areaCode - Código de área
   * @param {number} request.subscriptionPlanId - ID do plano de assinatura
   * @param {string} [request.idempotencyKey] - Chave de idempotência opcional
   * @returns {Promise<{phoneNumber: string, success: boolean}>}
   */
  async createPhoneNumber(request) {
    const url = `${this.baseUrl}/phone-numbers`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Idempotency-Key': request.idempotencyKey || undefined,
      'X-API-Key': this.apiKey,
    };
    const body = {
      areaCode: request.areaCode,
      subscriptionPlanId: request.subscriptionPlanId,
    };

    try {
      const response = await this.circuitBreaker.execute(
        () => this.retryPolicy.execute(
          () => this.httpClient.post(url, body, headers)
        )
      );

      if (response && response.data) {
        return {
          phoneNumber: response.data.phoneNumber,
          success: true,
        };
      } else {
        return {
          phoneNumber: null,
          success: false,
        };
      }
    } catch (error) {
      console.error('Error creating phone number via CustomApiGateway:', error.message);
      return {
        phoneNumber: null,
        success: false,
      };
    }
  }
}

module.exports = CustomApiGatewayImpl;
