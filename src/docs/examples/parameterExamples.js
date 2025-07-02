import parameterGenerator from "../utils/parameterGenerator.js";

// Exemplos criados por CHATGPT

// 1. Exemplo básico - Todos os parâmetros do model Users
const basicUsersParams = parameterGenerator.getAllParameters('Users', ['Senha']);

// 2. Exemplo customizado - Users com descrições personalizadas
const customUsersParams = parameterGenerator.getCustomParameters('Users', {
  excludeFields: ['Senha', 'Avatar'],
  customDescriptions: {
    id: "ID único do usuário",
    Nome: "Nome completo do usuário",
    Email: "Endereço de email do usuário"
  },
  customValidations: {
    id: { minimum: 1 },
    Email: { format: 'email' }
  }
});

// 3. Exemplo para Despesas
const despesasParams = parameterGenerator.getCustomParameters('Despesas', {
  excludeFields: ['Usu_rios_id'], // Excluir chave estrangeira
  customDescriptions: {
    id: "ID da despesa",
    Nome: "Nome/descrição da despesa",
    Valor_Total: "Valor total da despesa",
    Forma_pagamento: "Forma de pagamento utilizada",
    Data_pagamento: "Data do pagamento",
    Numero_parcelas: "Número total de parcelas",
    Parcela_atual: "Parcela atual",
    Valor_parcelas: "Valor de cada parcela"
  },
  customValidations: {
    Valor_Total: { minimum: 0.01 },
    Numero_parcelas: { minimum: 1, maximum: 100 },
    Parcela_atual: { minimum: 1 }
  }
});

// 4. Exemplo para Despesas Recorrentes
const despesasRecorrentesParams = parameterGenerator.getCustomParameters('Despesas_recorrentes', {
  excludeFields: ['Usu_rios_id'],
  customDescriptions: {
    id: "ID da despesa recorrente",
    Nome: "Nome/descrição da despesa recorrente",
    Valor: "Valor da despesa recorrente",
    Tipo_recorrencia: "Tipo de recorrência (semanal, mensal, anual)",
    Data_pagamento: "Data do pagamento"
  },
  customValidations: {
    Valor: { minimum: 0.01 },
    Tipo_recorrencia: { 
      enum: ['semanal', 'mensal', 'anual']
    }
  }
});

// 5. Apenas paginação (sem filtros)
const paginationOnly = parameterGenerator.getPaginationParameters();

// 6. Apenas filtros (sem paginação)
const filtersOnly = parameterGenerator.getFilterParameters('Users', ['Senha']);

// 7. Verificar models disponíveis
const availableModels = parameterGenerator.getAvailableModels();
console.log('Models disponíveis:', availableModels);

// 8. Obter informações detalhadas de um model
const usersModelInfo = parameterGenerator.getModelInfo('Users');
console.log('Informações do model Users:', usersModelInfo);

/**
 * Exemplos de uso em rotas
 */

// Rota de Users
export const usersRouteExample = {
  "/users": {
    get: {
      parameters: customUsersParams,
      // ... resto da configuração
    }
  }
};

// Rota de Despesas
export const despesasRouteExample = {
  "/despesas": {
    get: {
      parameters: despesasParams,
      // ... resto da configuração
    }
  }
};

// Rota de Despesas Recorrentes
export const despesasRecorrentesRouteExample = {
  "/despesas-recorrentes": {
    get: {
      parameters: despesasRecorrentesParams,
      // ... resto da configuração
    }
  }
};

/**
 * Função helper para criar parâmetros rapidamente
 */
export function createStandardParams(modelName, excludeFields = []) {
  return parameterGenerator.getAllParameters(modelName, excludeFields);
}

/**
 * Função helper para criar parâmetros com validações padrão
 */
export function createValidatedParams(modelName, config = {}) {
  const defaultConfig = {
    excludeFields: [],
    includePagination: true,
    customDescriptions: {},
    customValidations: {}
  };
  
  return parameterGenerator.getCustomParameters(modelName, { ...defaultConfig, ...config });
}

export default {
  basicUsersParams,
  customUsersParams,
  despesasParams,
  despesasRecorrentesParams,
  paginationOnly,
  filtersOnly,
  createStandardParams,
  createValidatedParams
};
