export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'KYC Platform API',
    version: '1.0.0',
    description: 'API de KYC (Know Your Customer) en el Edge con Cloudflare Workers, Hono.js y D1 Database.',
  },
  servers: [
    {
      url: 'http://127.0.0.1:8787',
      description: 'Servidor local de desarrollo (Wrangler)',
    },
  ],
  paths: {
    '/verification': {
      post: {
        summary: 'Iniciar una nueva verificación de KYC',
        description: 'Permite registrar un usuario cargando su selfie y su documento de identidad.',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Nombre completo del usuario (mínimo 2 caracteres)',
                    example: 'Juan',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    description: 'Dirección de correo electrónico',
                    example: 'juan@test.com',
                  },
                  documentNumber: {
                    type: 'string',
                    description: 'Número de identificación nacional',
                    example: '12345678',
                  },
                  selfie: {
                    type: 'string',
                    format: 'binary',
                    description: 'Imagen de selfie del usuario (JPG, PNG, WEBP; máx. 5MB)',
                  },
                  document: {
                    type: 'string',
                    format: 'binary',
                    description: 'Imagen del documento de identidad (JPG, PNG, WEBP; máx. 5MB)',
                  },
                },
                required: ['name', 'email', 'documentNumber', 'selfie', 'document'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Verificación iniciada con éxito',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/VerificationResponse',
                },
              },
            },
          },
          '400': {
            description: 'Error de validación o datos de entrada incorrectos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/verification/{id}': {
      get: {
        summary: 'Consultar el estado de una verificación de KYC',
        description: 'Retorna el estado de verificación e información asociada usando su UUID único.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID único de verificación (UUID v4)',
            schema: {
              type: 'string',
              format: 'uuid',
            },
            example: 'e041ec11-abe6-4161-9be7-f7c954042899',
          },
        ],
        responses: {
          '200': {
            description: 'Datos de verificación retornados exitosamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/VerificationGetResponse',
                },
              },
            },
          },
          '400': {
            description: 'El ID provisto no tiene formato UUID válido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'No se encontró la verificación',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Verification: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'e041ec11-abe6-4161-9be7-f7c954042899',
          },
          name: {
            type: 'string',
            example: 'Juan',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'juan@test.com',
          },
          documentNumber: {
            type: 'string',
            example: '12345678',
          },
          status: {
            type: 'string',
            enum: ['pending', 'approved', 'rejected'],
            example: 'pending',
          },
          selfieUrl: {
            type: 'string',
            format: 'uri',
            example: 'https://storage.kyc-platform.local/selfies/359edd9c-dd25-48a2-a381-fe5d613cebfd.jpg',
          },
          documentUrl: {
            type: 'string',
            format: 'uri',
            example: 'https://storage.kyc-platform.local/documents/1eed62a2-b520-4f07-858e-436e5f2fab79.png',
          },
          createdAt: {
            type: 'integer',
            example: 1782765075241,
          },
          updatedAt: {
            type: 'integer',
            example: 1782765075241,
          },
        },
      },
      VerificationResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Verificación iniciada correctamente.',
          },
          data: {
            $ref: '#/components/schemas/Verification',
          },
        },
      },
      VerificationGetResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            $ref: '#/components/schemas/Verification',
          },
        },
      },
      ErrorDetail: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
            example: 'email',
          },
          message: {
            type: 'string',
            example: 'Formato de email inválido',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Error de validación en el formulario de verificación',
          },
          errors: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ErrorDetail',
            },
            nullable: true,
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2026-06-29T20:31:41.717Z',
          },
        },
      },
    },
  },
};
