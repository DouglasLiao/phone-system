const { v4: uuidv4 } = require('uuid')

class IdempotencyKey {
  constructor(value = null) {
    this.value = value || uuidv4()
  }

  getValue() {
    return this.value
  }

  static generate() {
    return new IdempotencyKey()
  }

  toString() {
    return this.value
  }
}

module.exports = IdempotencyKey
