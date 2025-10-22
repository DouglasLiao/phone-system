const CreatePhoneLineDto = require('../../application/dto/CreatePhoneLineDto')

/**
 * @swagger
 * components:
 *   schemas:
 *     PhoneLineController:
 *       description: Controller responsável por operações de linhas telefônicas
 */
class PhoneLineController {
  constructor(createPhoneLineUseCase, getPhoneLinesUseCase, getSubscriptionPlansUseCase) {
    this.createPhoneLineUseCase = createPhoneLineUseCase
    this.getPhoneLinesUseCase = getPhoneLinesUseCase
    this.getSubscriptionPlansUseCase = getSubscriptionPlansUseCase

    // Bind methods para preservar o contexto
    this.createPhoneLine = this.createPhoneLine.bind(this)
    this.getPhoneLines = this.getPhoneLines.bind(this)
    this.getSubscriptionPlans = this.getSubscriptionPlans.bind(this)
  }

  /**
   * @swagger
   * /api/phone-lines:
   *   post:
   *     summary: Criar nova linha telefônica
   *     description: |
   *       Cria uma nova linha telefônica com número gerado automaticamente.
   *
   *       **Funcionalidades:**
   *       - Geração automática de número via CUSTOM API
   *       - Fallback para geração local em caso de falha
   *       - Suporte a idempotência
   *       - Circuit breaker para resiliência
   *
   *       **Comportamento de Idempotência:**
   *       - Mesma chave retorna a linha existente (HTTP 200)
   *       - Chaves diferentes criam novas linhas (HTTP 201)
   *     tags: [Phone Lines]
   *     parameters:
   *       - $ref: '#/components/parameters/IdempotencyKey'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreatePhoneLineRequest'
   *           examples:
   *             sao_paulo_whatsapp:
   *               summary: São Paulo - WhatsApp
   *               value:
   *                 areaCode: 11
   *                 subscriptionPlanId: 1
   *             rio_1_GB:
   *               summary: Rio de Janeiro - 1 GB
   *               value:
   *                 areaCode: 21
   *                 subscriptionPlanId: 2
   *     responses:
   *       '201':
   *         description: Linha telefônica criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/PhoneLine'
   *             example:
   *               success: true
   *               data:
   *                 id: "550e8400-e29b-41d4-a716-446655440000"
   *                 phoneNumber: "(11) 98765-4321"
   *                 areaCode: 11
   *                 subscriptionPlan:
   *                   id: 1
   *                   name: "WhatsApp"
   *                 createdAt: "2025-10-06T14:30:00.000Z"
   *                 idempotencyKey: "123e4567-e89b-12d3-a456-426614174000"
   *               message: "Phone line created successfully"
   *       '200':
   *         description: Linha existente retornada (idempotência)
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/PhoneLine'
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '409':
   *         $ref: '#/components/responses/Conflict'
   *       '500':
   *         $ref: '#/components/responses/InternalServerError'
   *       '503':
   *         $ref: '#/components/responses/ServiceUnavailable'
   */
  async createPhoneLine(req, res, next) {
    try {
      const dto = CreatePhoneLineDto.fromRequest(req.body)
      const result = await this.createPhoneLineUseCase.execute(dto)

      res.status(201).json({
        success: true,
        data: result,
        message: 'Phone line created successfully'
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /api/phone-lines:
   *   get:
   *     summary: Listar linhas telefônicas
   *     description: |
   *       Retorna todas as linhas telefônicas criadas com opção de filtros.
   *
   *       **Funcionalidades:**
   *       - Listagem completa ou filtrada por código de área
   *       - Ordenação por data de criação (mais recentes primeiro)
   *       - Informações completas incluindo plano de assinatura
   *     tags: [Phone Lines]
   *     parameters:
   *       - name: areaCode
   *         in: query
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 11
   *           maximum: 99
   *         description: Filtrar por código de área (DDD)
   *         example: 11
   *     responses:
   *       '200':
   *         description: Lista de linhas telefônicas
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/PhoneLine'
   *                     count:
   *                       type: integer
   *                       description: Número total de linhas retornadas
   *             examples:
   *               multiple_lines:
   *                 summary: Múltiplas linhas
   *                 value:
   *                   success: true
   *                   data:
   *                     - id: "550e8400-e29b-41d4-a716-446655440000"
   *                       phoneNumber: "(11) 98765-4321"
   *                       areaCode: 11
   *                       subscriptionPlan:
   *                         id: 1
   *                         name: "WhatsApp"
   *                       createdAt: "2025-10-06T14:30:00.000Z"
   *                     - id: "550e8400-e29b-41d4-a716-446655440001"
   *                       phoneNumber: "(21) 97654-3210"
   *                       areaCode: 21
   *                       subscriptionPlan:
   *                         id: 2
   *                         name: "1 GB"
   *                       createdAt: "2025-10-06T14:25:00.000Z"
   *                   count: 2
   *               empty_list:
   *                 summary: Lista vazia
   *                 value:
   *                   success: true
   *                   data: []
   *                   count: 0
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '500':
   *         $ref: '#/components/responses/InternalServerError'
   */
  async getPhoneLines(req, res, next) {
    try {
      const { areaCode } = req.query
      const filters = {}

      if (areaCode) {
        const areaCodeNum = parseInt(areaCode)
        if (isNaN(areaCodeNum)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid area code format'
          })
        }
        filters.areaCode = areaCodeNum
      }

      const result = await this.getPhoneLinesUseCase.execute(filters)

      res.json({
        success: true,
        data: result,
        count: result.length
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /api/subscription-plans:
   *   get:
   *     summary: Listar planos de assinatura
   *     description: |
   *       Retorna todos os planos de assinatura disponíveis para criação de linhas.
   *
   *       **Planos Disponíveis:**
   *       - WhatsApp
   *       - Planos de dados (1GB, 3GB, 5GB)
   *     tags: [Subscription Plans]
   *     responses:
   *       '200':
   *         description: Lista de planos de assinatura
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/SubscriptionPlan'
   *             example:
   *               success: true
   *               data:
   *                 - id: 1
   *                   name: "WhatsApp"
   *                   description: "Acesso completo ao WhatsApp"
   *                 - id: 2
   *                   name: "1 GB"
   *                   description: "Plano básico com 1GB de dados"
   *                 - id: 3
   *                   name: "3 GB"
   *                   description: "Plano intermediário com 3GB de dados"
   *                 - id: 4
   *                   name: "5 GB"
   *                   description: "Plano premium com 5GB de dados"
   *       '500':
   *         $ref: '#/components/responses/InternalServerError'
   */
  async getSubscriptionPlans(req, res, next) {
    try {
      const result = await this.getSubscriptionPlansUseCase.execute()

      res.json({
        success: true,
        data: result
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = PhoneLineController
