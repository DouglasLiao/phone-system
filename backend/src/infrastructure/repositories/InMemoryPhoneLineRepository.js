const PhoneLineRepository = require('../../domain/ports/PhoneLineRepository')

class InMemoryPhoneLineRepository extends PhoneLineRepository {
  constructor() {
    super()
    this.phoneLines = new Map() // id -> PhoneLine
    this.idempotencyIndex = new Map() // idempotencyKey -> phoneLineId
  }

  async save(phoneLine) {
    this.phoneLines.set(phoneLine.id, phoneLine)

    if (phoneLine.idempotencyKey) {
      this.idempotencyIndex.set(phoneLine.idempotencyKey, phoneLine.id)
    }
  }

  async findById(id) {
    return this.phoneLines.get(id) || null
  }

  async findByAreaCode(areaCode) {
    return Array.from(this.phoneLines.values())
      .filter(phoneLine => phoneLine.areaCode.getValue() === areaCode)
  }

  async findByIdempotencyKey(key) {
    const phoneLineId = this.idempotencyIndex.get(key)
    if (!phoneLineId) return null
    return this.phoneLines.get(phoneLineId) || null
  }

  async findAll() {
    return Array.from(this.phoneLines.values())
  }

  // Métodos úteis para testes
  clear() {
    this.phoneLines.clear()
    this.idempotencyIndex.clear()
  }

  size() {
    return this.phoneLines.size
  }
}

module.exports = InMemoryPhoneLineRepository
