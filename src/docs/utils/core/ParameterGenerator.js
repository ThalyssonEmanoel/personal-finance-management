/**
 * @ParameterGenerator Classe responsável por gerar parâmetros para endpoints
 */
class ParameterGenerator {
  constructor(models) {
    this.models = models;
  }

  /**
   * @getFilterParameters Gera parâmetros de filtro para um model específico
   */
  getFilterParameters(modelName, excludeFields = []) {
    const model = this.models[modelName];
    if (!model) {
      console.warn(`Model ${modelName} não encontrado no schema`);
      return [];
    }

    const parameters = [];

    Object.entries(model).forEach(([fieldName, fieldConfig]) => {
      if (excludeFields.includes(fieldName)) {
        return;
      }

      const parameter = {
        name: fieldName,
        in: "query",
        description: `Filtrar por ${fieldName}`,
        required: false,
        schema: {
          type: fieldConfig.type
        }
      };

      if (fieldConfig.format) {
        parameter.schema.format = fieldConfig.format;
      }

      if (fieldConfig.nullable) {
        parameter.schema.nullable = true;
      }

      parameters.push(parameter);
    });

    return parameters;
  }

  /**
   * @getPathIdParameter Gera apenas o parâmetro de ID para endpoints que usam path parameters
   */
  getPathIdParameter(description = "ID único do registro") {
    return [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
          minimum: 1
        },
        description: description,
        example: 1
      }
    ];
  }

  /**
   * @getAllParameters Gera todos os parâmetros (paginação + filtros) para um model
   */
  getAllParameters(modelName, excludeFields = []) {
    return [
      ...this.getPaginationParameters(),
      ...this.getFilterParameters(modelName, excludeFields)
    ];
  }

  /**
   * @getCustomParameters Gera parâmetros customizados com configurações específicas
   */
  getCustomParameters(modelName, config = {}) {
    const {
      excludeFields = [],
      customDescriptions = {},
      customValidations = {}
    } = config;

    let parameters = [];

    const filterParams = this.getFilterParameters(modelName, excludeFields);

    // Aplicar customizações
    filterParams.forEach(param => {
      if (customDescriptions[param.name]) {
        param.description = customDescriptions[param.name];
      }

      if (customValidations[param.name]) {
        param.schema = { ...param.schema, ...customValidations[param.name] };
      }
    });

    return [...parameters, ...filterParams];
  }
}

export default ParameterGenerator;
