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
          recurring_type: { type: "string", enum: ["daily", "weekly", "monthly", "yearly"], nullable: true },
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
        recurring: true,
        recurring_type: "monthly",
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
          recurring_type: { type: "string", enum: ["daily", "weekly", "monthly", "yearly"], nullable: true },
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
        recurring: true,
        recurring_type: "weekly",
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
          recurring_type: { type: "string", enum: ["daily", "weekly", "monthly", "yearly"], nullable: true },
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
        recurring: true,
        recurring_type: "daily",
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
