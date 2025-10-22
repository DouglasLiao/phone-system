class PhoneLineResponseDto {
  constructor(id, phoneNumber, areaCode, subscriptionPlan, createdAt, idempotencyKey) {
    this.id = id
    this.phoneNumber = phoneNumber
    this.areaCode = areaCode
    this.subscriptionPlan = subscriptionPlan
    this.createdAt = createdAt
    this.idempotencyKey = idempotencyKey
  }

  static fromEntity(phoneLine) {
    return new PhoneLineResponseDto(
      phoneLine.id,
      phoneLine.phoneNumber.getValue(),
      phoneLine.areaCode.getValue(),
      {
        id: phoneLine.subscriptionPlan.id,
        name: phoneLine.subscriptionPlan.name
      },
      phoneLine.createdAt,
      phoneLine.idempotencyKey
    )
  }

  static fromEntityList(phoneLines) {
    return phoneLines.map(phoneLine => this.fromEntity(phoneLine))
  }
}

module.exports = PhoneLineResponseDto
