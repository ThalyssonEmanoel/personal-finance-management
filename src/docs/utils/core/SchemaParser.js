/**
 * @SchemaParser Classe responsável por fazer parse do schema.prisma
 */
import fs from 'fs';
import path from 'path';

class SchemaParser {
  constructor() {
    this.schemaPath = path.resolve('prisma/schema.prisma');
    this.models = {};
    this.parseSchema();
  }

  /**
   * @parseSchema Parse do schema.prisma para extrair informações dos models
   * Usa regex para capturar blocos como model User
   */
  parseSchema() {
    try {
      const schemaContent = fs.readFileSync(this.schemaPath, 'utf8');
      
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
   * @parseModelFields Parse dos campos de um model específico
   */
  parseModelFields(modelContent) {
    const fields = {};
    const fieldRegex = /(\w+)\s+(String\??|Int\??|Float\??|Boolean\??|DateTime\??|\w+\??)/g;

    let match;
    while ((match = fieldRegex.exec(modelContent)) !== null) {
      const fieldName = match[1];
      const fieldType = match[2];

      // Ignorar campos de relacionamento e campos especiais
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

  /**
   * @getModels Retorna todos os models parseados
   */
  getModels() {
    return this.models;
  }
}

export default SchemaParser;
