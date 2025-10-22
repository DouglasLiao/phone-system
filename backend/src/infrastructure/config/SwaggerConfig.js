const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Douglas Phone Line Creation API',
      version: '1.0.0',
      description: `
# Douglas Phone Line Creation System API

## Visão Geral
API RESTful para criação e gerenciamento de linhas telefônicas desenvolvida com arquitetura hexagonal.
Este sistema demonstra práticas avançadas de engenharia de software incluindo:

- **Arquitetura Hexagonal** (Ports & Adapters)
- **Padrões de Resiliência** (Circuit Breaker, Retry Policy)
- **Idempotência** com chaves únicas
- **Integração Externa** com CUSTOM API
- **Observabilidade** com health checks e métricas

## Funcionalidades Principais
- Criação de linhas telefônicas com geração automática de números
- Listagem de linhas criadas com filtros
- Consulta de planos de assinatura disponíveis
- Monitoramento de saúde do sistema em tempo real
- Integração resiliente com APIs externas

## Padrões Implementados
- **Idempotência**: Todas as operações de criação suportam chaves de idempotência
- **Circuit Breaker**: Proteção contra falhas de APIs externas
- **Graceful Degradation**: Geração de números fallback quando CUSTOM API indisponível
- **Structured Logging**: Logs JSON para melhor observabilidade
      `,
      contact: {
        name: 'Douglas - Desenvolvedor FullStack',
        email: 'douglasliaozy@gmail.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      schemas: {
        PhoneLine: {
          type: 'object',
          required: ['id', 'phoneNumber', 'areaCode', 'subscriptionPlan', 'createdAt'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Identificador único da linha telefônica',
              example: '550e8400-e29b-41d4-a716-446655440000'
            },
            phoneNumber: {
              type: 'string',
              description: 'Número de telefone formatado',
              pattern: '^\\(\\d{2}\\) \\d{4,5}-\\d{4}$',
              example: '(11) 98765-4321'
            },
            areaCode: {
              type: 'integer',
              minimum: 11,
              maximum: 99,
              description: 'Código de área brasileiro (DDD)',
              example: 11
            },
            subscriptionPlan: {
              $ref: '#/components/schemas/SubscriptionPlan'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora de criação da linha',
              example: '2025-10-06T14:30:00.000Z'
            },
            idempotencyKey: {
              type: 'string',
              format: 'uuid',
              description: 'Chave de idempotência usada na criação',
              example: '123e4567-e89b-12d3-a456-426614174000'
            }
          }
        },
        SubscriptionPlan: {
          type: 'object',
          required: ['id', 'name'],
          properties: {
            id: {
              type: 'integer',
              description: 'Identificador único do plano',
              example: 1
            },
            name: {
              type: 'string',
              description: 'Nome do plano de assinatura',
              example: 'WhatsApp'
            },
            description: {
              type: 'string',
              description: 'Descrição detalhada do plano',
              example: 'Plano com acesso completo ao WhatsApp'
            }
          }
        },
        CreatePhoneLineRequest: {
          type: 'object',
          required: ['areaCode', 'subscriptionPlanId'],
          properties: {
            areaCode: {
              type: 'integer',
              minimum: 11,
              maximum: 99,
              description: 'Código de área brasileiro (DDD)',
              example: 11
            },
            subscriptionPlanId: {
              type: 'integer',
              minimum: 1,
              description: 'ID do plano de assinatura',
              example: 1
            }
          }
        },
        HealthCheckResponse: {
          type: 'object',
          required: ['status', 'timestamp', 'environment'],
          properties: {
            status: {
              type: 'string',
              enum: ['OK', 'ERROR'],
              description: 'Status geral do sistema',
              example: 'OK'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp da verificação',
              example: '2025-10-06T14:30:00.000Z'
            },
            environment: {
              type: 'string',
              description: 'Ambiente em execução',
              example: 'development'
            },
            circuitBreaker: {
              $ref: '#/components/schemas/CircuitBreakerMetrics'
            },
            uptime: {
              type: 'number',
              description: 'Tempo de atividade em segundos',
              example: 3600.5
            },
            memoryUsage: {
              type: 'object',
              properties: {
                rss: {
                  type: 'number',
                  description: 'Resident Set Size em bytes'
                },
                heapUsed: {
                  type: 'number',
                  description: 'Heap usado em bytes'
                },
                heapTotal: {
                  type: 'number',
                  description: 'Heap total em bytes'
                }
              }
            }
          }
        },
        CircuitBreakerMetrics: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['CLOSED', 'OPEN', 'HALF_OPEN'],
              description: 'Estado atual do circuit breaker',
              example: 'CLOSED'
            },
            failureCount: {
              type: 'integer',
              minimum: 0,
              description: 'Contador de falhas',
              example: 0
            },
            successCount: {
              type: 'integer',
              minimum: 0,
              description: 'Contador de sucessos',
              example: 15
            },
            lastFailureTime: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp da última falha',
              nullable: true
            },
            nextAttemptTime: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp da próxima tentativa (se OPEN)',
              nullable: true
            }
          }
        },
        ApiResponse: {
          type: 'object',
          required: ['success'],
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica se a operação foi bem-sucedida'
            },
            data: {
              description: 'Dados da resposta (varia por endpoint)'
            },
            error: {
              type: 'string',
              description: 'Mensagem de erro (apenas em falhas)',
              nullable: true
            },
            message: {
              type: 'string',
              description: 'Mensagem adicional',
              nullable: true
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          required: ['success', 'error'],
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Descrição do erro',
              example: 'Validation failed'
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    description: 'Campo que causou o erro'
                  },
                  message: {
                    type: 'string',
                    description: 'Mensagem específica do erro'
                  }
                }
              }
            }
          }
        }
      },
      parameters: {
        IdempotencyKey: {
          name: 'Idempotency-Key',
          in: 'header',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: `
Chave de idempotência para garantir que operações duplicadas não sejam executadas.

**Como usar:**
- Gere um UUID único para cada nova tentativa de criação
- Use a mesma chave para retry da mesma operação
- Chaves diferentes resultam em recursos diferentes

**Exemplo:** \`550e8400-e29b-41d4-a716-446655440000\`
          `,
          example: '550e8400-e29b-41d4-a716-446655440000'
        }
      },
      responses: {
        BadRequest: {
          description: 'Dados de entrada inválidos',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              examples: {
                validation_error: {
                  summary: 'Erro de validação',
                  value: {
                    success: false,
                    error: 'Validation failed',
                    details: [
                      {
                        field: 'areaCode',
                        message: 'Area code must be between 11 and 99'
                      }
                    ]
                  }
                },
                missing_header: {
                  summary: 'Header obrigatório ausente',
                  value: {
                    success: false,
                    error: 'Idempotency-Key header is required'
                  }
                }
              }
            }
          }
        },
        Conflict: {
          description: 'Conflito - Recurso já existe com a mesma chave de idempotência',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    type: 'object',
                    properties: {
                      data: {
                        $ref: '#/components/schemas/PhoneLine'
                      }
                    }
                  }
                ]
              },
              example: {
                success: true,
                data: {
                  id: '550e8400-e29b-41d4-a716-446655440000',
                  phoneNumber: '(11) 98765-4321',
                  areaCode: 11,
                  subscriptionPlan: {
                    id: 1,
                    name: 'WhatsApp'
                  },
                  createdAt: '2025-10-06T14:30:00.000Z',
                  idempotencyKey: '123e4567-e89b-12d3-a456-426614174000'
                }
              }
            }
          }
        },
        InternalServerError: {
          description: 'Erro interno do servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                error: 'Internal server error occurred'
              }
            }
          }
        },
        ServiceUnavailable: {
          description: 'Serviço temporariamente indisponível (Circuit Breaker ativo)',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                error: 'CUSTOM API service temporarily unavailable. Using fallback number generation.'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Phone Lines',
        description: 'Operações relacionadas a linhas telefônicas'
      },
      {
        name: 'Subscription Plans',
        description: 'Consulta de planos de assinatura disponíveis'
      },
      {
        name: 'Health Check',
        description: 'Monitoramento de saúde e métricas do sistema'
      }
    ]
  },
  apis: [
    './src/presentation/routes/*.js',
    './src/presentation/controllers/*.js'
  ]
}

const specs = swaggerJsdoc(options)

module.exports = {
  specs,
  swaggerUi,
  swaggerOptions: {
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #0F1829; }
      .swagger-ui .scheme-container { background: #EDE9E2; }
    `,
    customSiteTitle: 'Douglas Phone Line API Documentation'
  }
}
