/**
 * Gerador simples de parâmetros para documentação Swagger
 * Mantém apenas as funcionalidades que são realmente utilizadas
 */

class SimpleParameterGenerator {
  
  /**
   * Gera parâmetros customizados para filtros
   */
  getCustomParameters(modelName, config = {}) {
    const {
      excludeFields = [],
      customDescriptions = {}
    } = config;

    const baseTransactionParams = [
      {
        name: "type",
        in: "query",
        description: customDescriptions.type || "Filter by transaction type (expense or income)",
        required: false,
        schema: { type: "string", enum: ["expense", "income"] }
      },
      {
        name: "name",
        in: "query", 
        description: customDescriptions.name || "Filter by transaction name",
        required: false,
        schema: { type: "string" }
      },
      {
        name: "category",
        in: "query",
        description: customDescriptions.category || "Filter by transaction category", 
        required: false,
        schema: { type: "string" }
      },
      {
        name: "value",
        in: "query",
        description: customDescriptions.value || "Filter by transaction amount",
        required: false,
        schema: { type: "number" }
      },
      {
        name: "value_installment", 
        in: "query",
        description: customDescriptions.value_installment || "Filter by original installment total value",
        required: false,
        schema: { type: "number" }
      },
      {
        name: "release_date",
        in: "query",
        description: customDescriptions.release_date || "Filter by release date (YYYY-MM-DD format)",
        required: false,
        schema: { type: "string", format: "date" }
      },
      {
        name: "number_installments",
        in: "query", 
        description: customDescriptions.number_installments || "Filter by number of installments",
        required: false,
        schema: { type: "integer" }
      },
      {
        name: "current_installment",
        in: "query",
        description: customDescriptions.current_installment || "Filter by current installment number", 
        required: false,
        schema: { type: "integer" }
      },
      {
        name: "recurring",
        in: "query",
        description: customDescriptions.recurring || "Filter by recurring transactions (true/false)",
        required: false,
        schema: { type: "boolean" }
      },
      {
        name: "accountId",
        in: "query",
        description: customDescriptions.accountId || "Filter by account ID",
        required: false,
        schema: { type: "integer" }
      },
      {
        name: "paymentMethodId",
        in: "query", 
        description: customDescriptions.paymentMethodId || "Filter by payment method ID",
        required: false,
        schema: { type: "integer" }
      },
      {
        name: "userId",
        in: "query",
        description: customDescriptions.userId || "Filter by user ID",
        required: false,
        schema: { type: "integer" }
      },
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
    ];
    
    return baseTransactionParams.filter(param => !excludeFields.includes(param.name));
  }

  /**
   * Gera parâmetro de ID no path
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
   * Gera parâmetros de ID e userId na query
   */
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

  /**
   * Gera parâmetro de userId na query
   */
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
}

// Instância singleton
const parameterGenerator = new SimpleParameterGenerator();

export default parameterGenerator;
