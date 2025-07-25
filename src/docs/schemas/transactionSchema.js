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
          release_date: { type: "string", format: "date" },
          billing_day: { type: "integer", nullable: true },
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
        release_date: "2024-01-15",
        billing_day: null,
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
    required: ["type", "name", "category", "value", "release_date", "accountId", "paymentMethodId", "userId"],
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
        description: "Release date",
        example: "2024-01-15"
      },
      billing_day: {
        type: "integer",
        minimum: 1,
        maximum: 31,
        description: "Billing day (optional)",
        example: 15,
        nullable: true
      },
      number_installments: {
        type: "integer",
        minimum: 1,
        description: "Number of installments (optional)",
        example: 3,
        nullable: true
      },
      current_installment: {
        type: "integer",
        minimum: 1,
        description: "Current installment (optional)",
        example: 1,
        nullable: true
      },
      recurring: {
        type: "boolean",
        description: "Whether the transaction is recurring",
        example: false,
        default: false
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
          type: { type: "string", enum: ["expense", "income"] },
          name: { type: "string" },
          category: { type: "string" },
          value: { type: "number" },
          release_date: { type: "string", format: "date" },
          billing_day: { type: "integer", nullable: true },
          number_installments: { type: "integer", nullable: true },
          current_installment: { type: "integer", nullable: true },
          recurring: { type: "boolean" },
          accountId: { type: "integer" },
          paymentMethodId: { type: "integer" },
          userId: { type: "integer" }
        }
      }
    },
    description: "Schema for transaction creation response.",
    example: {
      transaction: {
        id: 1,
        type: "expense",
        name: "Supermercado",
        category: "Alimentação",
        value: 150.50,
        release_date: "2024-01-15",
        billing_day: null,
        number_installments: null,
        current_installment: null,
        recurring: false,
        accountId: 1,
        paymentMethodId: 1,
        userId: 1
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
        description: "Transaction type (optional)",
        example: "expense"
      },
      name: {
        type: "string",
        description: "Transaction name (optional)",
        example: "Supermercado"
      },
      category: {
        type: "string",
        description: "Transaction category (optional)",
        example: "Alimentação"
      },
      value: {
        type: "number",
        description: "Transaction amount (optional)",
        example: 150.50
      },
      release_date: {
        type: "string",
        format: "date",
        description: "Release date (optional)",
        example: "2024-01-15"
      },
      billing_day: {
        type: "integer",
        minimum: 1,
        maximum: 31,
        description: "Billing day (optional)",
        example: 15,
        nullable: true
      },
      number_installments: {
        type: "integer",
        minimum: 1,
        description: "Number of installments (optional)",
        example: 3,
        nullable: true
      },
      current_installment: {
        type: "integer",
        minimum: 1,
        description: "Current installment (optional)",
        example: 1,
        nullable: true
      },
      recurring: {
        type: "boolean",
        description: "Whether the transaction is recurring (optional)",
        example: false
      },
      accountId: {
        type: "integer",
        description: "Account ID (optional)",
        example: 1
      },
      paymentMethodId: {
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
          type: { type: "string", enum: ["expense", "income"] },
          name: { type: "string" },
          category: { type: "string" },
          value: { type: "number" },
          release_date: { type: "string", format: "date" },
          billing_day: { type: "integer", nullable: true },
          number_installments: { type: "integer", nullable: true },
          current_installment: { type: "integer", nullable: true },
          recurring: { type: "boolean" },
          accountId: { type: "integer" },
          paymentMethodId: { type: "integer" },
          userId: { type: "integer" }
        }
      }
    },
    description: "Schema for transaction update response.",
    example: {
      transaction: {
        id: 1,
        type: "expense",
        name: "Supermercado",
        category: "Alimentação",
        value: 175.50,
        release_date: "2024-01-15",
        billing_day: null,
        number_installments: null,
        current_installment: null,
        recurring: false,
        accountId: 1,
        paymentMethodId: 1,
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
