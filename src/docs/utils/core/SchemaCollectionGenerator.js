/**
 * @SchemaCollectionGenerator Classe responsável por gerar coleções completas de schemas
 */
import ResponseSchemaGenerator from './ResponseSchemaGenerator.js';

class SchemaCollectionGenerator {
  constructor(models) {
    this.models = models;
    this.responseSchemaGenerator = new ResponseSchemaGenerator(models);
  }

  /**
   * @getAllSchemas Gera todos os schemas (request e response) para um model
   */
  getAllSchemas(modelName, config = {}) {
    const {
      includeCreate = true,
      includeUpdate = true,
      includeResponse = true,
      includeList = true,
      includeDelete = true,
      includeMultipart = false,
      fileFields = [],
      ...commonConfig
    } = config;

    const schemas = {};

    // Response schemas
    if (includeResponse) {
      const responseSchema = this.responseSchemaGenerator.getResponseSchema(modelName, {
        title: `${modelName}Response`,
        ...commonConfig
      });
      if (responseSchema) schemas[responseSchema.title] = responseSchema;
    }

    if (includeList) {
      const listSchema = this.responseSchemaGenerator.getListResponseSchema(modelName, {
        title: `${modelName}ListResponse`,
        ...commonConfig
      });
      if (listSchema) schemas[listSchema.title] = listSchema;
    }

    if (includeDelete) {
      const deleteSchema = this.responseSchemaGenerator.getDeleteResponseSchema(modelName);
      schemas[deleteSchema.title] = deleteSchema;
    }

    return schemas;
  }

  /**
   * @getCRUDSchemas Gera schemas completos para operações CRUD
   */
  getCRUDSchemas(modelName, config = {}) {
    return this.getAllSchemas(modelName, {
      includeCreate: true,
      includeUpdate: true,
      includeResponse: true,
      includeList: true,
      includeDelete: true,
      includeMultipart: true,
      ...config
    });
  }

  /**
   * @getAPISchemas Gera schemas para API completa com múltiplos models
   */
  getAPISchemas(modelNames, globalConfig = {}) {
    const allSchemas = {};

    modelNames.forEach(modelName => {
      const modelConfig = globalConfig[modelName] || {};
      const schemas = this.getAllSchemas(modelName, modelConfig);
      Object.assign(allSchemas, schemas);
    });

    // Adicionar schemas comuns
    const errorSchema = this.responseSchemaGenerator.getErrorResponseSchema();
    allSchemas[errorSchema.title] = errorSchema;

    return allSchemas;
  }

  /**
   * @generateSwaggerComponents Gera o objeto components para Swagger
   */
  generateSwaggerComponents(modelNames, config = {}) {
    const schemas = this.getAPISchemas(modelNames, config);

    return {
      components: {
        schemas,
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      }
    };
  }
}

export default SchemaCollectionGenerator;
