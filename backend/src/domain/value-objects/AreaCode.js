const { InvalidAreaCodeError } = require('../errors/DomainErrors')

class AreaCode {
  constructor(value) {
    if (!this.isValid(value)) {
      throw new InvalidAreaCodeError(value)
    }
    this.value = value
  }

  getValue() {
    return this.value
  }

  isValid(areaCode) {
    return Number.isInteger(areaCode) && areaCode >= 11 && areaCode <= 99
  }

  toString() {
    return this.value.toString()
  }
}

module.exports = AreaCode
