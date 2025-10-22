const { InvalidPhoneNumberError } = require('../errors/DomainErrors')

class PhoneNumber {
  constructor(value) {
    if (!this.isValid(value)) {
      throw new InvalidPhoneNumberError(value)
    }
    this.value = value
  }

  getValue() {
    return this.value
  }

  isValid(phoneNumber) {
    if (typeof phoneNumber !== 'string') return false

    // Aceita diferentes formatos brasileiros
    const patterns = [
      /^\(\d{2}\) 9\d{4}-\d{4}$/, // (XX) 9XXXX-XXXX
      /^\d{2}9\d{8}$/,            // XX9XXXXXXXX
      /^\+55\d{2}9\d{8}$/         // +55XX9XXXXXXXX
    ]

    return patterns.some(pattern => pattern.test(phoneNumber))
  }

  // Normaliza o número para o formato padrão
  static normalize(phoneNumber) {
    // Remove caracteres especiais e espaços
    const cleaned = phoneNumber.replace(/[^\d]/g, '')

    // Se tem +55 no início, remove
    const withoutCountry = cleaned.startsWith('55') ? cleaned.slice(2) : cleaned

    // Formata para (XX) 9XXXX-XXXX
    if (withoutCountry.length === 11) {
      const areaCode = withoutCountry.slice(0, 2)
      const firstPart = withoutCountry.slice(2, 7)
      const secondPart = withoutCountry.slice(7)
      return `(${areaCode}) ${firstPart}-${secondPart}`
    }

    return phoneNumber // Retorna original se não conseguir normalizar
  }

  toString() {
    return this.value
  }
}

module.exports = PhoneNumber
