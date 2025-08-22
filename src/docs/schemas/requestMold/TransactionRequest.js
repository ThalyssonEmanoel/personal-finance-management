export function requestTransactionGet() {
  const parameters = [
    {
      "name": "id",
      "in": "query",
      "description": "Filter by transaction ID",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    },
    {
      "name": "type",
      "in": "query",
      "description": "Filter by transaction type",
      "required": false,
      "schema": {
        "type": "string",
        "enum": ["expense", "income"]
      }
    },
    {
      "name": "name",
      "in": "query",
      "description": "Filter by transaction name",
      "required": false,
      "schema": { "type": "string" }
    },
    {
      "name": "category",
      "in": "query",
      "description": "Filter by transaction category",
      "required": false,
      "schema": { "type": "string" }
    },
    {
      "name": "value",
      "in": "query",
      "description": "Filter by transaction value",
      "required": false,
      "schema": { "type": "number" }
    },
    {
      "name": "release_date",
      "in": "query",
      "description": "Filter by release date (YYYY-MM-DD format)",
      "required": false,
      "schema": { "type": "string", "format": "date" }
    },
    {
      "name": "recurring",
      "in": "query",
      "description": "Filter by recurring transactions",
      "required": false,
      "schema": { "type": "boolean" }
    },
    {
      "name": "accountId",
      "in": "query",
      "description": "Filter by account ID",
      "required": false,
      "schema": { "type": "integer", "minimum": 1 }
    },
    {
      "name": "number_installments",
      "in": "query",
      "description": "Filter by number of installments",
      "required": false,
      "schema": { "type": "integer", "minimum": 1 }
    },
    {
      "name": "current_installment",
      "in": "query",
      "description": "Filter by current installment number",
      "required": false,
      "schema": { "type": "integer", "minimum": 1 }
    },
    {
      "name": "paymentMethodId",
      "in": "query",
      "description": "Filter by payment method ID",
      "required": false,
      "schema": { "type": "integer", "minimum": 1 }
    },
    {
      "name": "userId",
      "in": "query",
      "description": "Filter by user ID",
      "required": false,
      "schema": { "type": "integer", "minimum": 1 }
    },
    {
      "name": "limit",
      "in": "query",
      "description": "Delimit the number of results returned",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "default": 10
      }
    },
    {
      "name": "page",
      "in": "query",
      "description": "Number of the page to be returned",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "default": 1
      }
    },
  ];
  return {
    parameters,
  };
}

export function requestTransactionPdf() {
  const parameters = [
    {
      "name": "userId",
      "in": "query",
      "description": "User ID to filter transactions",
      "required": true,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    },
    {
      "name": "startDate",
      "in": "query",
      "description": "Start date for the statement period (YYYY-MM-DD format)",
      "required": true,
      "schema": {
        "type": "string",
        "format": "date"
      }
    },
    {
      "name": "endDate",
      "in": "query",
      "description": "End date for the statement period (YYYY-MM-DD format)",
      "required": true,
      "schema": {
        "type": "string",
        "format": "date"
      }
    },
    {
      "name": "type",
      "in": "query",
      "description": "Type of transactions to include in the statement",
      "required": true,
      "schema": {
        "type": "string",
        "enum": ["all", "income", "expense"]
      }
    },
    {
      "name": "accountId",
      "in": "query",
      "description": "Account ID to filter transactions (optional - if not provided, includes all accounts)",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    }
  ];
  return {
    parameters,
  };
}
const TransactionRequest = {
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
      type: "expense",
      name: "Supermercado Atualizado",
      category: "Alimentação",
      value: 175.00,
      release_date: "2025-08-08",
      number_installments: 3,
      current_installment: 1,
      description: "Compra parcelada atualizada",
      recurring: false,
      accountId: 4,
      paymentMethodId: 2
    }
  },
};

export default TransactionRequest;