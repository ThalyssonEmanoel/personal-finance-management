/**
 * @RequestBodyGenerator Classe responsável por gerar request bodies para endpoints
 */
class RequestBodyGenerator {
  constructor(models) {
    this.models = models;
  }

  /**
   * @generateRequestBodySchema Gera schema de request body baseado no model
   */
  generateRequestBodySchema(modelName, config = {}) {
    const {
      excludeFields = [],
      requiredFields = [],
      optionalFields = [],
      customDescriptions = {},
      customValidations = {},
      title = `${modelName}Request`
    } = config;

    const model = this.models[modelName];
    if (!model) {
      console.warn(`Model ${modelName} não encontrado no schema`);
      return null;
    }

    const properties = {};
    const required = [];

    Object.entries(model).forEach(([fieldName, fieldConfig]) => {
      if (excludeFields.includes(fieldName)) {
        return;
      }

      // Determinar se o campo é obrigatório
      const isRequired = requiredFields.includes(fieldName) || 
                        (!fieldConfig.nullable && !optionalFields.includes(fieldName));

      if (isRequired) {
        required.push(fieldName);
      }

      // Criar propriedade do schema
      const property = {
        type: fieldConfig.type,
        description: customDescriptions[fieldName] || `Campo ${fieldName}`
      };

      // Adicionar formato se existir
      if (fieldConfig.format) {
        property.format = fieldConfig.format;
      }

      // Adicionar nullable se necessário
      if (fieldConfig.nullable) {
        property.nullable = true;
      }

      // Aplicar validações customizadas
      if (customValidations[fieldName]) {
        Object.assign(property, customValidations[fieldName]);
      }

      properties[fieldName] = property;
    });

    return {
      title,
      type: "object",
      properties,
      required: required.length > 0 ? required : undefined,
      description: `Schema para ${title}`
    };
  }

  /**
   * @getCreateRequestBody Gera request body para criação (CREATE)
   */
  getCreateRequestBody(modelName, config = {}) {
    const defaultConfig = {
      excludeFields: ['id'], // Geralmente excluímos ID em criação
      title: `Create${modelName}Request`,
      ...config
    };

    const schema = this.generateRequestBodySchema(modelName, defaultConfig);
    
    if (!schema) return null;

    return {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: `#/components/schemas/${schema.title}`
          }
        }
      }
    };
  }

  /**
   * @getUpdateRequestBody Gera request body para atualização (UPDATE)
   */
  getUpdateRequestBody(modelName, config = {}) {
    const defaultConfig = {
      excludeFields: ['id'], // Excluir ID em updates
      optionalFields: [], // Todos os campos são opcionais em update por padrão
      requiredFields: [], // Nenhum campo obrigatório em update
      title: `Update${modelName}Request`,
      ...config
    };

    // Tornar todos os campos opcionais se não especificado
    const model = this.models[modelName];
    if (model && !config.optionalFields && !config.requiredFields) {
      defaultConfig.optionalFields = Object.keys(model).filter(
        field => !defaultConfig.excludeFields.includes(field)
      );
    }

    const schema = this.generateRequestBodySchema(modelName, defaultConfig);
    
    if (!schema) return null;

    return {
      required: false,
      content: {
        "application/json": {
          schema: {
            $ref: `#/components/schemas/${schema.title}`
          }
        }
      }
    };
  }

  /**
   * @getMultipartRequestBody Gera request body para upload de arquivos (multipart/form-data)
   */
  getMultipartRequestBody(modelName, config = {}) {
    const {
      fileFields = [],
      title = `${modelName}FormRequest`,
      ...restConfig
    } = config;

    const schema = this.generateRequestBodySchema(modelName, {
      title,
      ...restConfig
    });

    if (!schema) return null;

    // Modificar campos de arquivo para formato binary
    fileFields.forEach(fieldName => {
      if (schema.properties[fieldName]) {
        schema.properties[fieldName] = {
          type: "string",
          format: "binary",
          description: schema.properties[fieldName].description || `Arquivo ${fieldName}`,
          nullable: schema.properties[fieldName].nullable
        };
      }
    });

    return {
      required: schema.required && schema.required.length > 0,
      content: {
        "multipart/form-data": {
          schema: {
            $ref: `#/components/schemas/${schema.title}`
          }
        }
      }
    };
  }
}

export default RequestBodyGenerator;
