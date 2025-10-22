const PhoneLine = require('../entities/PhoneLine')
const AreaCode = require('../value-objects/AreaCode')
const SubscriptionPlan = require('../entities/SubscriptionPlan')
const IdempotencyKey = require('../value-objects/IdempotencyKey')
const { DuplicatePhoneLineError } = require('../errors/DomainErrors')

class PhoneLineService {
  constructor(phoneLineRepository, apiGateway) {
    this.phoneLineRepository = phoneLineRepository
    this.apiGateway = apiGateway
  }

  /**
   * Creates a new phone line
   * @param {number} areaCode
   * @param {number} subscriptionPlanId
   * @param {string} [idempotencyKey]
   * @returns {Promise<PhoneLine>}
   */
  async createPhoneLine(areaCode, subscriptionPlanId, idempotencyKey = null) {
    // 1. Generate idempotency key if not provided
    const finalIdempotencyKey = idempotencyKey || new IdempotencyKey().getValue()

    // 2. Check idempotency
    const existing = await this.phoneLineRepository.findByIdempotencyKey(finalIdempotencyKey)
    if (existing) {
      return existing
    }

    // 3. Validate input (value object constructors handle validation)
    const areaCodeVO = new AreaCode(areaCode)
    const subscriptionPlan = SubscriptionPlan.fromId(subscriptionPlanId)

    // 4. Call CUSTOM API
    try {
      const response = await this.apiGateway.createPhoneNumber({
        areaCode: areaCodeVO.getValue(),
        subscriptionPlanId: subscriptionPlan.id,
        idempotencyKey: finalIdempotencyKey
      })

      // 5. Validate response and create entity
      if (!response || !response.success || !response.phoneNumber) {
        throw new Error('Failed to create phone number via external API.');
      }

      const phoneLine = PhoneLine.create(
        response.phoneNumber,
        areaCode,
        subscriptionPlanId,
        finalIdempotencyKey
      )

      // 6. Persist
      await this.phoneLineRepository.save(phoneLine)

      return phoneLine

    } catch (error) {
      throw error
    }
  }

  /**
   * Finds phone lines by area code
   * @param {number} [areaCode]
   * @returns {Promise<PhoneLine[]>}
   */
  async getPhoneLines(areaCode = null) {
    if (areaCode) {
      new AreaCode(areaCode) // Validates the area code
      return this.phoneLineRepository.findByAreaCode(areaCode)
    }
    return this.phoneLineRepository.findAll()
  }

  /**
   * Finds a phone line by ID
   * @param {string} id
   * @returns {Promise<PhoneLine|null>}
   */
  async getPhoneLineById(id) {
    return this.phoneLineRepository.findById(id)
  }
}

module.exports = PhoneLineService
