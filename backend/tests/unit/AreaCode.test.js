const AreaCode = require('../../src/domain/value-objects/AreaCode')
const { InvalidAreaCodeError } = require('../../src/domain/errors/DomainErrors')

describe('AreaCode Value Object', () => {
  describe('Valid area codes', () => {
    it('should accept valid area codes between 11 and 99', () => {
      expect(() => new AreaCode(11)).not.toThrow()
      expect(() => new AreaCode(21)).not.toThrow()
      expect(() => new AreaCode(85)).not.toThrow()
      expect(() => new AreaCode(99)).not.toThrow()
    })

    it('should return correct value', () => {
      const areaCode = new AreaCode(41)
      expect(areaCode.getValue()).toBe(41)
    })
  })

  describe('Invalid area codes', () => {
    it('should reject area codes below 11', () => {
      expect(() => new AreaCode(10)).toThrow(InvalidAreaCodeError)
      expect(() => new AreaCode(5)).toThrow(InvalidAreaCodeError)
      expect(() => new AreaCode(0)).toThrow(InvalidAreaCodeError)
    })

    it('should reject area codes above 99', () => {
      expect(() => new AreaCode(100)).toThrow(InvalidAreaCodeError)
      expect(() => new AreaCode(123)).toThrow(InvalidAreaCodeError)
    })

    it('should reject non-integer values', () => {
      expect(() => new AreaCode(21.5)).toThrow(InvalidAreaCodeError)
      expect(() => new AreaCode('21')).toThrow(InvalidAreaCodeError)
      expect(() => new AreaCode(null)).toThrow(InvalidAreaCodeError)
      expect(() => new AreaCode(undefined)).toThrow(InvalidAreaCodeError)
    })

    it('should throw InvalidAreaCodeError with correct message', () => {
      try {
        new AreaCode(10)
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidAreaCodeError)
        expect(error.message).toContain('Invalid area code: 10')
        expect(error.code).toBe('INVALID_AREA_CODE')
        expect(error.areaCode).toBe(10)
      }
    })
  })
})
