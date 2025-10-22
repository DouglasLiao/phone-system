const PhoneLineResponseDto = require('../dto/PhoneLineResponseDto')
const { DomainError } = require('../../domain/errors/DomainErrors')

class ApplicationError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message)
    this.name = 'ApplicationError'
    this.code = code
    this.statusCode = statusCode
  }
}

class CreatePhoneLineUseCase {
  constructor(phoneLineService) {
    this.phoneLineService = phoneLineService
  }

  async execute(dto) {
    try {
      // Validar DTO
      const validationErrors = dto.validate()
      if (validationErrors.length > 0) {
        throw new ApplicationError(
          `Validation failed: ${validationErrors.join(', ')}`,
          'VALIDATION_ERROR',
          400
        )
      }

      // Executar caso de uso
      const phoneLine = await this.phoneLineService.createPhoneLine(
        dto.areaCode,
        dto.subscriptionPlanId,
        dto.idempotencyKey
      )

      return PhoneLineResponseDto.fromEntity(phoneLine)

    } catch (error) {
      if (error instanceof ApplicationError) {
        throw error
      }

      if (error instanceof DomainError) {
        throw new ApplicationError(
          error.message,
          error.code,
          400
        )
      }

      // Erro não tratado
      throw new ApplicationError(
        'Internal server error',
        'INTERNAL_ERROR',
        500
      )
    }
  }
}

module.exports = { CreatePhoneLineUseCase, ApplicationError }
