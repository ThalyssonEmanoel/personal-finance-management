/**
 * @ParameterGenerator Classe responsável por gerar parâmetros para endpoints
 */
class ParameterGenerator {
  constructor(models) {
    this.models = models;
  }

  /**
   * @getFilterParameters Gera parâmetros de filtro para um model específico, incluindo page e limit por padrão
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

    // Adiciona page e limit como parâmetros padrão
    parameters.push(
      {
        name: "page",
        in: "query",
        description: "Número da página para paginação (padrão: 1)",
        required: false,
        schema: { type: "integer", default: 1, minimum: 1 }
      },
      {
        name: "limit",
        in: "query",
        description: "Quantidade de itens por página (padrão: 10)",
        required: false,
        schema: { type: "integer", default: 10, minimum: 1 }
      }
    );

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

  getQueryIdAndUserParameter(description = "ID do registro e ID do usuário") {
    return [
      {
        name: "id",
        in: "query",
        required: true,
        schema: {
          type: "integer",
          minimum: 1
        },
        description: description,
        example: 1
      },
      {
        name: "userId",
        in: "query",
        required: true,
        schema: {
          type: "integer",
          minimum: 1
        },
        description: "ID do usuário dono do registro",
        example: 1
      }
    ];
  }

  getQueryUserParameter(description = "ID do usuário") {
    return [
      {
        name: "userId",
        in: "query",
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
      customValidations = {},
      extraParameters = []
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

    // Adiciona parâmetros extras manualmente
    if (Array.isArray(extraParameters) && extraParameters.length > 0) {
      parameters = [...filterParams, ...extraParameters];
    } else {
      parameters = filterParams;
    }

    return parameters;
  }

  /**
   * @getPathIdWithQueryParameters Gera parâmetro de ID no path + parâmetros de query customizados
   */
  getPathIdWithQueryParameters(modelName, config = {}) {
    const {
      idDescription = "ID único do registro",
      excludeFields = [],
      customDescriptions = {},
      customValidations = {},
      extraParameters = [],
      includeFilters = true
    } = config;

    const parameters = [];

    // Adiciona o parâmetro de ID no path
    parameters.push({
      name: "userId",
      in: "path",
      required: true,
      schema: {
        type: "integer",
        minimum: 1
      },
      description: idDescription,
      example: 1
    });

    // Se includeFilters for true, adiciona os parâmetros de query
    if (includeFilters && modelName) {
      const filterParams = this.getFilterParameters(modelName, excludeFields);

      // Aplicar customizações nos parâmetros de filtro
      filterParams.forEach(param => {
        if (customDescriptions[param.name]) {
          param.description = customDescriptions[param.name];
        }

        if (customValidations[param.name]) {
          param.schema = { ...param.schema, ...customValidations[param.name] };
        }
      });

      parameters.push(...filterParams);
    }

    // Adiciona parâmetros extras manualmente
    if (Array.isArray(extraParameters) && extraParameters.length > 0) {
      parameters.push(...extraParameters);
    }

    return parameters;
  }
}

export default ParameterGenerator;
