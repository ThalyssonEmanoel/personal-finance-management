const TransactionSchemas = {
  TransactionResponse: {
    title: "TransactionResponse",
    type: "object",
    properties: {
      transaction: {
        type: "object",
        description: "Transaction data.",
        properties: {
          id: { type: "integer" },
          tipo: { type: "string", enum: ["despesa", "receita"] },
          nome: { type: "string" },
          categoria: { type: "string" },
          subcategoria: { type: "string", nullable: true },
          valor: { type: "number" },
          data_pagamento: { type: "string", format: "date" },
          dia_cobranca: { type: "integer", nullable: true },
          quantidade_parcelas: { type: "integer", nullable: true },
          parcela_atual: { type: "integer", nullable: true },
          recorrente: { type: "boolean" },
          contaId: { type: "integer" },
          formaPagamentoId: { type: "integer" },
          userId: { type: "integer" },
          conta: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              type: { type: "string" }
            }
          },
          formaPagamento: {
            type: "object",
            properties: {
              id: { type: "integer" },
              nome: { type: "string" }
            }
          },
          usuario: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" }
            }
          }
        }
      }
    },
    description: "Schema for transaction response.",
    example: {
      transaction: {
        id: 1,
        tipo: "despesa",
        nome: "Supermercado",
        categoria: "Alimentação",
        subcategoria: "Compras",
        valor: 150.50,
        data_pagamento: "2024-01-15",
        dia_cobranca: null,
        quantidade_parcelas: null,
        parcela_atual: null,
        recorrente: false,
        contaId: 1,
        formaPagamentoId: 1,
        userId: 1,
        conta: {
          id: 1,
          name: "Conta Corrente",
          type: "Corrente"
        },
        formaPagamento: {
          id: 1,
          nome: "Débito"
        },
        usuario: {
          id: 1,
          name: "João Silva"
        }
      }
    }
  },
  CreateTransactionRequest: {
    title: "CreateTransactionRequest",
    type: "object",
    required: ["tipo", "nome", "categoria", "valor", "data_pagamento", "contaId", "formaPagamentoId", "userId"],
    properties: {
      tipo: {
        type: "string",
        enum: ["despesa", "receita"],
        description: "Transaction type",
        example: "despesa"
      },
      nome: {
        type: "string",
        description: "Transaction name",
        example: "Supermercado"
      },
      categoria: {
        type: "string",
        description: "Transaction category",
        example: "Alimentação"
      },
      subcategoria: {
        type: "string",
        description: "Transaction subcategory (optional)",
        example: "Compras",
        nullable: true
      },
      valor: {
        type: "number",
        description: "Transaction amount",
        example: 150.50
      },
      data_pagamento: {
        type: "string",
        format: "date",
        description: "Payment date",
        example: "2024-01-15"
      },
      dia_cobranca: {
        type: "integer",
        minimum: 1,
        maximum: 31,
        description: "Billing day (optional)",
        example: 15,
        nullable: true
      },
      quantidade_parcelas: {
        type: "integer",
        minimum: 1,
        description: "Number of installments (optional)",
        example: 3,
        nullable: true
      },
      parcela_atual: {
        type: "integer",
        minimum: 1,
        description: "Current installment (optional)",
        example: 1,
        nullable: true
      },
      recorrente: {
        type: "boolean",
        description: "Whether the transaction is recurring",
        example: false,
        default: false
      },
      contaId: {
        type: "integer",
        description: "Account ID",
        example: 1
      },
      formaPagamentoId: {
        type: "integer",
        description: "Payment method ID",
        example: 1
      },
      userId: {
        type: "integer",
        description: "User ID",
        example: 1
      }
    },
    description: "Schema for creating a new transaction"
  },
  CreateTransactionResponse: {
    title: "CreateTransactionResponse",
    type: "object",
    properties: {
      transaction: {
        type: "object",
        description: "Created transaction data.",
        properties: {
          id: { type: "integer" },
          tipo: { type: "string", enum: ["despesa", "receita"] },
          nome: { type: "string" },
          categoria: { type: "string" },
          subcategoria: { type: "string", nullable: true },
          valor: { type: "number" },
          data_pagamento: { type: "string", format: "date" },
          dia_cobranca: { type: "integer", nullable: true },
          quantidade_parcelas: { type: "integer", nullable: true },
          parcela_atual: { type: "integer", nullable: true },
          recorrente: { type: "boolean" },
          contaId: { type: "integer" },
          formaPagamentoId: { type: "integer" },
          userId: { type: "integer" }
        }
      }
    },
    description: "Schema for transaction creation response.",
    example: {
      transaction: {
        id: 1,
        tipo: "despesa",
        nome: "Supermercado",
        categoria: "Alimentação",
        subcategoria: "Compras",
        valor: 150.50,
        data_pagamento: "2024-01-15",
        dia_cobranca: null,
        quantidade_parcelas: null,
        parcela_atual: null,
        recorrente: false,
        contaId: 1,
        formaPagamentoId: 1,
        userId: 1
      }
    }
  },
  UpdateTransactionRequest: {
    title: "UpdateTransactionRequest",
    type: "object",
    properties: {
      tipo: {
        type: "string",
        enum: ["despesa", "receita"],
        description: "Transaction type (optional)",
        example: "despesa"
      },
      nome: {
        type: "string",
        description: "Transaction name (optional)",
        example: "Supermercado"
      },
      categoria: {
        type: "string",
        description: "Transaction category (optional)",
        example: "Alimentação"
      },
      subcategoria: {
        type: "string",
        description: "Transaction subcategory (optional)",
        example: "Compras",
        nullable: true
      },
      valor: {
        type: "number",
        description: "Transaction amount (optional)",
        example: 150.50
      },
      data_pagamento: {
        type: "string",
        format: "date",
        description: "Payment date (optional)",
        example: "2024-01-15"
      },
      dia_cobranca: {
        type: "integer",
        minimum: 1,
        maximum: 31,
        description: "Billing day (optional)",
        example: 15,
        nullable: true
      },
      quantidade_parcelas: {
        type: "integer",
        minimum: 1,
        description: "Number of installments (optional)",
        example: 3,
        nullable: true
      },
      parcela_atual: {
        type: "integer",
        minimum: 1,
        description: "Current installment (optional)",
        example: 1,
        nullable: true
      },
      recorrente: {
        type: "boolean",
        description: "Whether the transaction is recurring (optional)",
        example: false
      },
      contaId: {
        type: "integer",
        description: "Account ID (optional)",
        example: 1
      },
      formaPagamentoId: {
        type: "integer",
        description: "Payment method ID (optional)",
        example: 1
      }
    },
    description: "Schema for updating a transaction"
  },
  UpdateTransactionResponse: {
    title: "UpdateTransactionResponse",
    type: "object",
    properties: {
      transaction: {
        type: "object",
        description: "Updated transaction data.",
        properties: {
          id: { type: "integer" },
          tipo: { type: "string", enum: ["despesa", "receita"] },
          nome: { type: "string" },
          categoria: { type: "string" },
          subcategoria: { type: "string", nullable: true },
          valor: { type: "number" },
          data_pagamento: { type: "string", format: "date" },
          dia_cobranca: { type: "integer", nullable: true },
          quantidade_parcelas: { type: "integer", nullable: true },
          parcela_atual: { type: "integer", nullable: true },
          recorrente: { type: "boolean" },
          contaId: { type: "integer" },
          formaPagamentoId: { type: "integer" },
          userId: { type: "integer" }
        }
      }
    },
    description: "Schema for transaction update response.",
    example: {
      transaction: {
        id: 1,
        tipo: "despesa",
        nome: "Supermercado",
        categoria: "Alimentação",
        subcategoria: "Compras",
        valor: 175.50,
        data_pagamento: "2024-01-15",
        dia_cobranca: null,
        quantidade_parcelas: null,
        parcela_atual: null,
        recorrente: false,
        contaId: 1,
        formaPagamentoId: 1,
        userId: 1
      }
    }
  },
  DeleteTransactionResponse: {
    title: "DeleteTransactionResponse",
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Deletion confirmation message"
      }
    },
    description: "Schema for transaction deletion response.",
    example: {
      message: "Transaction deleted successfully"
    }
  },
  TransactionIdParameter: {
    name: "id",
    in: "path",
    required: true,
    schema: {
      type: "integer",
      minimum: 1
    },
    description: "Unique transaction ID",
    example: 1
  }
};

export default TransactionSchemas;
