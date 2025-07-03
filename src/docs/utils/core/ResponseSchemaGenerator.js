/**
 * @ResponseSchemaGenerator Classe responsável por gerar schemas de resposta
 */
class ResponseSchemaGenerator {
  constructor(models) {
    this.models = models;
  }

  /**
   * @getResponseSchema Gera schema de resposta baseado no model
   */
  getResponseSchema(modelName, config = {}) {
    const {
      excludeFields = ['Senha'], // Por padrão, excluir senhas
      title = `${modelName}Response`,
      wrapInDataProperty = true,
      customDescriptions = {}
    } = config;

    const model = this.models[modelName];
    if (!model) {
      console.warn(`Model ${modelName} não encontrado no schema`);
      return null;
    }

    const properties = {};

    Object.entries(model).forEach(([fieldName, fieldConfig]) => {
      if (excludeFields.includes(fieldName)) {
        return;
      }

      const property = {
        type: fieldConfig.type,
        description: customDescriptions[fieldName] || `Campo ${fieldName}`
      };

      if (fieldConfig.format) {
        property.format = fieldConfig.format;
      }

      if (fieldConfig.nullable) {
        property.nullable = true;
      }

      properties[fieldName] = property;
    });

    const dataSchema = {
      title: wrapInDataProperty ? `${modelName}Data` : title,
      type: "object",
      properties,
      description: `Dados de ${modelName}`
    };

    if (wrapInDataProperty) {
      return {
        title,
        type: "object",
        properties: {
          [modelName.toLowerCase()]: {
            $ref: `#/components/schemas/${dataSchema.title}`
          }
        },
        description: `Schema para resposta de ${modelName}`
      };
    }

    return dataSchema;
  }

  /**
   * @getListResponseSchema Gera schema para resposta de listagem (com paginação)
   */
  getListResponseSchema(modelName, config = {}) {
    const {
      title = `${modelName}ListResponse`,
      itemTitle = `${modelName}Item`,
      ...restConfig
    } = config;

    const itemSchema = this.getResponseSchema(modelName, {
      title: itemTitle,
      wrapInDataProperty: false,
      ...restConfig
    });

    if (!itemSchema) return null;

    return {
      title,
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            $ref: `#/components/schemas/${itemSchema.title}`
          },
          description: `Lista de ${modelName}`
        },
        pagination: {
          type: "object",
          properties: {
            total: {
              type: "integer",
              description: "Total de registros"
            },
            page: {
              type: "integer",
              description: "Página atual"
            },
            limit: {
              type: "integer",
              description: "Registros por página"
            },
            pages: {
              type: "integer",
              description: "Total de páginas"
            }
          }
        }
      },
      description: `Schema para resposta de listagem de ${modelName}`
    };
  }

  /**
   * @getErrorResponseSchema Gera schema para resposta de erro
   */
  getErrorResponseSchema(title = "ErrorResponse") {
    return {
      title,
      type: "object",
      properties: {
        error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Mensagem de erro"
            },
            code: {
              type: "integer",
              description: "Código do erro"
            },
            details: {
              type: "array",
              items: {
                type: "string"
              },
              description: "Detalhes adicionais do erro"
            }
          }
        }
      },
      description: "Schema para resposta de erro"
    };
  }

  /**
   * @getDeleteResponseSchema Gera schema para resposta de deleção
   */
  getDeleteResponseSchema(modelName, title = `Delete${modelName}Response`) {
    return {
      title,
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Mensagem de confirmação da exclusão",
          example: `${modelName} deletado com sucesso`
        }
      },
      description: `Schema para resposta de exclusão de ${modelName}`
    };
  }
}

export default ResponseSchemaGenerator;
