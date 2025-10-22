const PhoneLineResponseDto = require('../dto/PhoneLineResponseDto')
const { DomainError } = require('../../domain/errors/DomainErrors')
const { ApplicationError } = require('./CreatePhoneLineUseCase')

class GetPhoneLinesUseCase {
  constructor(phoneLineService) {
    this.phoneLineService = phoneLineService
  }

  async execute(filters = {}) {
    try {
      const { areaCode } = filters

      const phoneLines = await this.phoneLineService.getPhoneLines(areaCode)
      return PhoneLineResponseDto.fromEntityList(phoneLines)

    } catch (error) {
      if (error instanceof DomainError) {
        throw new ApplicationError(
          error.message,
          error.code,
          400
        )
      }

      throw new ApplicationError(
        'Internal server error',
        'INTERNAL_ERROR',
        500
      )
    }
  }
}

module.exports = GetPhoneLinesUseCase
