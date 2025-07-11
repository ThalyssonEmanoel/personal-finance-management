import SchemaParser from './core/SchemaParser.js';
import ParameterGenerator from './core/ParameterGenerator.js';
import ResponseSchemaGenerator from './core/ResponseSchemaGenerator.js';
import SchemaCollectionGenerator from './core/SchemaCollectionGenerator.js';
/**
 * @SwaggerGenerator Façade principal que combina todos os geradores
 * Mantém compatibilidade com código existente
 */
class SwaggerGenerator {
  constructor() {
    // Inicializar parser do schema
    this.schemaParser = new SchemaParser();
    const models = this.schemaParser.getModels();

    // Inicializar geradores
    this.parameterGenerator = new ParameterGenerator(models);
    this.responseSchemaGenerator = new ResponseSchemaGenerator(models);
    this.schemaCollectionGenerator = new SchemaCollectionGenerator(models);
  }

  getFilterParameters(modelName, excludeFields = []) {
    return this.parameterGenerator.getFilterParameters(modelName, excludeFields);
  }

  getPathIdParameter(description = "ID único do registro") {
    return this.parameterGenerator.getPathIdParameter(description);
  }

  getAllParameters(modelName, excludeFields = []) {
    return this.parameterGenerator.getAllParameters(modelName, excludeFields);
  }

  getCustomParameters(modelName, config = {}) {
    return this.parameterGenerator.getCustomParameters(modelName, config);
  }

  getResponseSchema(modelName, config = {}) {
    return this.responseSchemaGenerator.getResponseSchema(modelName, config);
  }

  getListResponseSchema(modelName, config = {}) {
    return this.responseSchemaGenerator.getListResponseSchema(modelName, config);
  }

  getErrorResponseSchema(title = "ErrorResponse") {
    return this.responseSchemaGenerator.getErrorResponseSchema(title);
  }

  getDeleteResponseSchema(modelName, title) {
    return this.responseSchemaGenerator.getDeleteResponseSchema(modelName, title);
  }

  getAllSchemas(modelName, config = {}) {
    return this.schemaCollectionGenerator.getAllSchemas(modelName, config);
  }

  getCRUDSchemas(modelName, config = {}) {
    return this.schemaCollectionGenerator.getCRUDSchemas(modelName, config);
  }

  getAPISchemas(modelNames, globalConfig = {}) {
    return this.schemaCollectionGenerator.getAPISchemas(modelNames, globalConfig);
  }

  generateSwaggerComponents(modelNames, config = {}) {
    return this.schemaCollectionGenerator.generateSwaggerComponents(modelNames, config);
  }

  getAvailableModels() {
    return this.schemaParser.getAvailableModels();
  }

  getModelInfo(modelName) {
    return this.schemaParser.getModelInfo(modelName);
  }

  get parameters() {
    return this.parameterGenerator;
  }

  get responses() {
    return this.responseSchemaGenerator;
  }

  get schemas() {
    return this.schemaCollectionGenerator;
  }

  get parser() {
    return this.schemaParser;
  }
}

// Instância singleton para compatibilidade
const parameterGenerator = new SwaggerGenerator();

export default parameterGenerator;
