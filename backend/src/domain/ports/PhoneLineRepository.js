/**
 * Interface for phone line repository
 * In JavaScript, we use comments to document the "interface"
 */
class PhoneLineRepository {
  /**
   * Saves a phone line
   * @param {PhoneLine} phoneLine
   * @returns {Promise<void>}
   */
  async save(phoneLine) {
    throw new Error('Method save must be implemented')
  }

  /**
   * Finds a phone line by ID
   * @param {string} id
   * @returns {Promise<PhoneLine|null>}
   */
  async findById(id) {
    throw new Error('Method findById must be implemented')
  }

  /**
   * Finds phone lines by area code
   * @param {number} areaCode
   * @returns {Promise<PhoneLine[]>}
   */
  async findByAreaCode(areaCode) {
    throw new Error('Method findByAreaCode must be implemented')
  }

  /**
   * Finds a phone line by idempotency key
   * @param {string} key
   * @returns {Promise<PhoneLine|null>}
   */
  async findByIdempotencyKey(key) {
    throw new Error('Method findByIdempotencyKey must be implemented')
  }

  /**
   * Finds all phone lines
   * @returns {Promise<PhoneLine[]>}
   */
  async findAll() {
    throw new Error('Method findAll must be implemented')
  }
}

module.exports = PhoneLineRepository
