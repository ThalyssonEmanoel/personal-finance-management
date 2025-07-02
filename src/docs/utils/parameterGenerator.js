/**
 * 
 *@Referências
  https://gitlab.fslab.dev/f-brica-de-software-iv-2025-1/refeicoes/-/tree/master/src
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions

 * 
**/
import fs from 'fs';
import path from 'path';


/**
 * @ParameterGenerator Classe para gerar parâmetros padronizados baseados nos models do Prisma
 */
class ParameterGenerator {
  constructor() {
    this.schemaPath = path.resolve('prisma/schema.prisma');
    this.models = {};
    this.parseSchema();
  }

  /**
   * @parseSchema Parse do schema.prisma para extrair informações dos models
   *  Usa regex para capturar blocos como model User
   */
  parseSchema() {
    try {
      //o schemaContent ele lê o arquivo schema do prisma
      const schemaContent = fs.readFileSync(this.schemaPath, 'utf8');//Tenho que ver ese esse fs pode ler foto 
      /**
       * \s+ - Corresponde a um ou mais espaços em branco
       * (\w+) - Grupo 1: Captura o nome do model (uma ou mais letras, números ou underscore)
       * \s* - Corresponde a zero ou mais espaços em branco
       * { - Corresponde literalmente ao caractere de abertura de chave
       * ([^}]+) - Grupo 2: Captura tudo que não seja } (conteúdo interno do model)
       * } - Corresponde literalmente ao caractere de fechamento de chave
       * /g - Flag global para encontrar todas as ocorrências
       */
      const modelRegex = /model\s+(\w+)\s*{([^}]+)}/g;

      let match;
      // Enquanto houver correspondências, ou seja, enquanto o regex encontrar modelos no schema irá capturar o nome do model e seu conteúdo
      while ((match = modelRegex.exec(schemaContent)) !== null) {
        const modelName = match[1];
        const modelContent = match[2];

        this.models[modelName] = this.parseModelFields(modelContent);
      }
    } catch (error) {
      console.error('Erro ao ler schema.prisma:', error);
    }
  }

  /**
   * @paseModelFields Parse dos campos de um model específico
   */
  parseModelFields(modelContent) {
    const fields = {};
    const fieldRegex = /(\w+)\s+(String\??|Int\??|Float\??|Boolean\??|DateTime\??|\w+\??)/g;

    let match;
    while ((match = fieldRegex.exec(modelContent)) !== null) {
      const fieldName = match[1];
      const fieldType = match[2];

      // Ignorar campos de relacionamento e campos especiais -> Para evitar problemas com campos que não são necessários na documentação, mas infelizmente nem sempre é possível
      if (!fieldName.includes('@@') && !fieldName.includes('@relation')) {
        fields[fieldName] = this.mapPrismaTypeToSwagger(fieldType);
      }
    }

    return fields;
  }

  /**
   * @mapPrismaTypeToSwagger Mapeia tipos do Prisma para tipos do Swagger
   */
  mapPrismaTypeToSwagger(prismaType) {
    const typeMap = {
      'String': 'string',
      'String?': 'string',
      'Int': 'integer',
      'Int?': 'integer',
      'Float': 'number',
      'Float?': 'number',
      'Boolean': 'boolean',
      'Boolean?': 'boolean',
      'DateTime': 'string',
      'DateTime?': 'string'
    };

    return {
      type: typeMap[prismaType] || 'string',
      nullable: prismaType.includes('?'),
      format: prismaType.includes('DateTime') ? 'date-time' : undefined
    };
  }

  /**
   * @getPaginationParameters Gera parâmetros de paginação padrão
   */
  getPaginationParameters() {
    return [
      {
        name: "page",
        in: "query",
        description: "Número da página para paginação",
        required: false,
        schema: {
          type: "integer",
          minimum: 1,
          default: 1
        }
      },
      {
        name: "limit",
        in: "query",
        description: "Limite de registros por página",
        required: false,
        schema: {
          type: "integer",
          minimum: 1,
          maximum: 100,
          default: 10
        }
      }
    ];
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

    // Itera sobre os campos do model e cria parâmetros de filtro. Itera é basicamente um loop que percorre cada campo do model
    // Object.entries(model) retorna um array de pares [chave, valor] para cada campo do model
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
      includePagination = true,
      customDescriptions = {},
      customValidations = {}
    } = config;

    let parameters = [];

    if (includePagination) {
      parameters = [...parameters, ...this.getPaginationParameters()];
    }

    const filterParams = this.getFilterParameters(modelName, excludeFields);

    // Aplicar customizações no caso para excluir campos, adicionar descrições e validações
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

  /**
   * @getAvailableModels Lista todos os models disponíveis
   */
  getAvailableModels() {
    return Object.keys(this.models);
  }

  /**
   * @getModelInfo Obtém informações detalhadas de um model
   */
  getModelInfo(modelName) {
    return this.models[modelName] || null;
  }
}

// Instância singleton para reutilização
const parameterGenerator = new ParameterGenerator();

export default parameterGenerator;
