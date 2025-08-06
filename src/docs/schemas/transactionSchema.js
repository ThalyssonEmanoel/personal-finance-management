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
          type: { type: "string", enum: ["expense", "income"] },
          name: { type: "string" },
          category: { type: "string" },
          value: { type: "number" },
          value_installment: { type: "number", nullable: true },
          release_date: { type: "string", format: "date" },
          number_installments: { type: "integer", nullable: true },
          current_installment: { type: "integer", nullable: true },
          recurring: { type: "boolean" },
          accountId: { type: "integer" },
          paymentMethodId: { type: "integer" },
          userId: { type: "integer" },
          account: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              type: { type: "string" }
            }
          },
          paymentMethod: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" }
            }
          },
          user: {
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
        type: "expense",
        name: "Supermercado",
        category: "Alimentação",
        value: 150.50,
        value_installment: null,
        release_date: "2024-01-15",
        number_installments: null,
        current_installment: null,
        recurring: false,
        accountId: 1,
        paymentMethodId: 1,
        userId: 1,
        account: {
          id: 1,
          name: "Conta Corrente",
          type: "Corrente"
        },
        paymentMethod: {
          id: 1,
          name: "Débito"
        },
        user: {
          id: 1,
          name: "João Silva"
        }
      }
    }
  },
  CreateTransactionRequest: {
    title: "CreateTransactionRequest",
    type: "object",
    required: ["type", "name", "category", "value", "release_date", "accountId", "paymentMethodId"],
    properties: {
      type: {
        type: "string",
        enum: ["expense", "income"],
        description: "Transaction type",
        example: "expense"
      },
      name: {
        type: "string",
        description: "Transaction name",
        example: "Supermercado"
      },
      category: {
        type: "string",
        description: "Transaction category",
        example: "Alimentação"
      },
      value: {
        type: "number",
        description: "Total transaction amount (for installments, this will be divided automatically)",
        example: 150.50
      },
      // value_installment e current_installment foram removidos - agora são calculados automaticamente
      release_date: {
        type: "string",
        format: "date",
        description: "Transaction date",
        example: "2024-01-15"
      },
      number_installments: {
        type: "integer",
        nullable: true,
        description: "Number of installments (system will calculate installment values automatically)",
        example: 3
      },
      description: {
        type: "string",
        nullable: true,
        description: "Transaction description",
        example: "Compras do mês"
      },
      recurring: {
        type: "boolean",
        description: "Whether the transaction is recurring",
        example: false
      },
      accountId: {
        type: "integer",
        description: "Account ID",
        example: 1
      },
      paymentMethodId: {
        type: "integer",
        description: "Payment method ID",
        example: 1
      }
    },
    description: "Schema for creating a new transaction. For installment transactions, only provide the total value and number of installments - the system will calculate individual installment values automatically.",
    example: {
      type: "expense",
      name: "Supermercado",
      category: "Alimentação",
      value: 100.00,
      release_date: "2025-07-06",
      number_installments: 3,
      description: "Compra parcelada",
      recurring: false,
      accountId: 1,
      paymentMethodId: 1
    }
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
          type: { type: "string", enum: ["expense", "income"] },
          name: { type: "string" },
          category: { type: "string" },
          value: { type: "number" },
          value_installment: { type: "number", nullable: true },
          release_date: { type: "string", format: "date" },
          number_installments: { type: "integer", nullable: true },
          current_installment: { type: "integer", nullable: true },
          recurring: { type: "boolean" },
          accountId: { type: "integer" },
          paymentMethodId: { type: "integer" },
          userId: { type: "integer" },
          account: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              type: { type: "string" }
            }
          },
          paymentMethod: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" }
            }
          },
          installmentPreview: {
            type: "array",
            nullable: true,
            description: "Preview of installment values (only present for installment transactions)",
            items: {
              type: "object",
              properties: {
                installment: { type: "integer", description: "Installment number" },
                value: { type: "number", description: "Installment value" }
              }
            }
          }
        }
      }
    },
    description: "Schema for created transaction response. For installment transactions, includes a preview of calculated installment values.",
    example: {
      transaction: {
        id: 1,
        type: "expense",
        name: "Supermercado",
        category: "Alimentação",
        value: 100.00,
        value_installment: 33.33,
        release_date: "2025-07-06",
        number_installments: 3,
        current_installment: 1,
        recurring: false,
        accountId: 1,
        paymentMethodId: 1,
        userId: 2,
        account: {
          id: 1,
          name: "Conta Corrente",
          type: "Corrente"
        },
        paymentMethod: {
          id: 1,
          name: "Dinheiro"
        },
        installmentPreview: [
          { installment: 1, value: 33.33 },
          { installment: 2, value: 33.33 },
          { installment: 3, value: 33.34 }
        ]
      }
    }
  },
  UpdateTransactionRequest: {
    title: "UpdateTransactionRequest",
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["expense", "income"],
        description: "Transaction type",
        example: "expense"
      },
      name: {
        type: "string",
        description: "Transaction name",
        example: "Supermercado"
      },
      category: {
        type: "string",
        description: "Transaction category",
        example: "Alimentação"
      },
      value: {
        type: "number",
        description: "Transaction amount",
        example: 150.50
      },
      release_date: {
        type: "string",
        format: "date",
        description: "Transaction date",
        example: "2024-01-15"
      },
      number_installments: {
        type: "integer",
        nullable: true,
        description: "Number of installments",
        example: 3
      },
      current_installment: {
        type: "integer",
        nullable: true,
        description: "Current installment number",
        example: 1
      },
      description: {
        type: "string",
        nullable: true,
        description: "Transaction description",
        example: "Compras do mês"
      },
      recurring: {
        type: "boolean",
        description: "Whether the transaction is recurring",
        example: false
      },
      accountId: {
        type: "integer",
        description: "Account ID",
        example: 1
      },
      paymentMethodId: {
        type: "integer",
        description: "Payment method ID",
        example: 1
      }
    },
    description: "Schema for updating a transaction.",
    example: {
      name: "Supermercado Atualizado",
      value: 175.00
    }
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
          type: { type: "string", enum: ["expense", "income"] },
          name: { type: "string" },
          category: { type: "string" },
          value: { type: "number" },
          release_date: { type: "string", format: "date" },
          number_installments: { type: "integer", nullable: true },
          current_installment: { type: "integer", nullable: true },
          recurring: { type: "boolean" },
          accountId: { type: "integer" },
          paymentMethodId: { type: "integer" },
          userId: { type: "integer" },
          account: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              type: { type: "string" }
            }
          },
          paymentMethod: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" }
            }
          }
        }
      }
    },
    description: "Schema for updated transaction response.",
    example: {
      transaction: {
        id: 1,
        type: "expense",
        name: "Supermercado Atualizado",
        category: "Alimentação",
        value: 175.00,
        release_date: "2024-01-15",
        number_installments: null,
        current_installment: null,
        recurring: false,
        accountId: 1,
        paymentMethodId: 1,
        userId: 1,
        account: {
          id: 1,
          name: "Conta Corrente",
          type: "Corrente"
        },
        paymentMethod: {
          id: 1,
          name: "Débito"
        }
      }
    }
  },
  DeleteTransactionResponse: {
    title: "DeleteTransactionResponse",
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Success message"
      }
    },
    description: "Schema for transaction deletion response.",
    example: {
      message: "Transação deletada com sucesso"
    }
  }
};

export default TransactionSchemas;
