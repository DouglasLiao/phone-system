const PhoneNumber = require('../../src/domain/value-objects/PhoneNumber')
const { InvalidPhoneNumberError } = require('../../src/domain/errors/DomainErrors')

describe('PhoneNumber Value Object', () => {
  describe('Valid phone numbers', () => {
    it('should accept formatted Brazilian phone numbers', () => {
      expect(() => new PhoneNumber('(41) 99999-9999')).not.toThrow()
      expect(() => new PhoneNumber('(11) 91234-5678')).not.toThrow()
      expect(() => new PhoneNumber('(85) 98765-4321')).not.toThrow()
    })

    it('should accept unformatted Brazilian phone numbers', () => {
      expect(() => new PhoneNumber('41999999999')).not.toThrow()
      expect(() => new PhoneNumber('11912345678')).not.toThrow()
    })

    it('should accept international format', () => {
      expect(() => new PhoneNumber('+5541999999999')).not.toThrow()
      expect(() => new PhoneNumber('+5511912345678')).not.toThrow()
    })

    it('should return correct value', () => {
      const phoneNumber = new PhoneNumber('(41) 99999-9999')
      expect(phoneNumber.getValue()).toBe('(41) 99999-9999')
    })
  })

  describe('Invalid phone numbers', () => {
    it('should reject invalid formats', () => {
      expect(() => new PhoneNumber('123456789')).toThrow(InvalidPhoneNumberError)
      expect(() => new PhoneNumber('(41) 8999-9999')).toThrow(InvalidPhoneNumberError) // não começa com 9
      expect(() => new PhoneNumber('41 99999-9999')).toThrow(InvalidPhoneNumberError) // sem parênteses
      expect(() => new PhoneNumber('')).toThrow(InvalidPhoneNumberError)
    })

    it('should reject non-string values', () => {
      expect(() => new PhoneNumber(41999999999)).toThrow(InvalidPhoneNumberError)
      expect(() => new PhoneNumber(null)).toThrow(InvalidPhoneNumberError)
      expect(() => new PhoneNumber(undefined)).toThrow(InvalidPhoneNumberError)
    })
  })

  describe('Phone number normalization', () => {
    it('should normalize different formats to standard format', () => {
      expect(PhoneNumber.normalize('41999999999')).toBe('(41) 99999-9999')
      expect(PhoneNumber.normalize('+5541999999999')).toBe('(41) 99999-9999')
      expect(PhoneNumber.normalize('(41) 99999-9999')).toBe('(41) 99999-9999')
    })

    it('should handle edge cases in normalization', () => {
      expect(PhoneNumber.normalize('41 99999-9999')).toBe('(41) 99999-9999')
      expect(PhoneNumber.normalize('41.99999.9999')).toBe('(41) 99999-9999')
    })

    it('should return original if cannot normalize', () => {
      expect(PhoneNumber.normalize('invalid')).toBe('invalid')
      expect(PhoneNumber.normalize('123')).toBe('123')
    })
  })
})
