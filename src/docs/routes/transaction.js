import commonResponses from "../schemas/swaggerCommonResponses.js";

const transactionRoutes = {
  "/transactions/admin": {
    get: {
      tags: ["Transactions"],
      summary: "List all transactions (Admin Only)",
      description: `
        #### Use Case
        Allows the system to list all registered transactions, with the possibility of filtering by specific parameters.

        #### Business Rule
        Provides a paginated listing of registered transactions, with detailed information for each transaction.

        #### Business Rules Involved
        - Allow filtering by defined parameters.
        - Return error if no transactions are registered.
        - Include related data (account, payment method, user).

        #### Expected Result
        Returns a paginated list of transactions with detailed information and related data.
      `,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "query",
          description: "Filter by transaction ID",
          required: false,
          schema: { type: "integer", minimum: 1 }
        },
        {
          name: "type",
          in: "query",
          description: "Filter by transaction type",
          required: false,
          schema: { type: "string", enum: ["expense", "income"] }
        },
        {
          name: "name",
          in: "query",
          description: "Filter by transaction name",
          required: false,
          schema: { type: "string" }
        },
        {
          name: "category",
          in: "query",
          description: "Filter by transaction category",
          required: false,
          schema: { type: "string" }
        },
        {
          name: "value",
          in: "query",
          description: "Filter by transaction value",
          required: false,
          schema: { type: "number" }
        },
        {
          name: "release_date",
          in: "query",
          description: "Filter by release date (YYYY-MM-DD format)",
          required: false,
          schema: { type: "string", format: "date" }
        },
        {
          name: "recurring",
          in: "query",
          description: "Filter by recurring transactions",
          required: false,
          schema: { type: "boolean" }
        },
        {
          name: "accountName",
          in: "query",
          description: "Filter by account name",
          required: false,
          schema: { type: "string" }
        },
        {
          name: "number_installments",
          in: "query",
          description: "Filter by number of installments",
          required: false,
          schema: { type: "integer", minimum: 1 }
        },
        {
          name: "current_installment",
          in: "query",
          description: "Filter by current installment number",
          required: false,
          schema: { type: "integer", minimum: 1 }
        },
        {
          name: "paymentMethod",
          in: "query",
          description: "Filter by payment method ID",
          required: false,
          schema: { type: "integer", minimum: 1 }
        },
        {
          name: "userId",
          in: "query",
          description: "Filter by user ID",
          required: false,
          schema: { type: "integer", minimum: 1 }
        },
        {
          name: "page",
          in: "query",
          description: "Page number for pagination",
          required: false,
          schema: { type: "integer", minimum: 1, default: 1 }
        },
        {
          name: "limit",
          in: "query",
          description: "Number of items per page",
          required: false,
          schema: { type: "integer", minimum: 1, default: 10 }
        }
      ],
      responses: {
        200: commonResponses[200]("#/components/schemas/TransactionResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
  },
  "/transactions": {
    get: {
      tags: ["Transactions"],
      summary: "List all transactions",
      description: `
        #### Use Case
        Allows the system to list all registered transactions, with the possibility of filtering by specific parameters.

        #### Business Rule
        Provides a paginated listing of registered transactions, with detailed information for each transaction.

        #### Business Rules Involved
        - Allow filtering by defined parameters.
        - Return error if no transactions are registered.
        - Include related data (account, payment method, user).

        #### Expected Result
        Returns a paginated list of transactions with detailed information and related data.
      `,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "query",
          description: "Filter by transaction ID",
          required: false,
          schema: { type: "integer", minimum: 1 }
        },
        {
          name: "type",
          in: "query",
          description: "Filter by transaction type",
          required: false,
          schema: { type: "string", enum: ["expense", "income"] }
        },
        {
          name: "name",
          in: "query",
          description: "Filter by transaction name",
          required: false,
          schema: { type: "string" }
        },
        {
          name: "category",
          in: "query",
          description: "Filter by transaction category",
          required: false,
          schema: { type: "string" }
        },
        {
          name: "value",
          in: "query",
          description: "Filter by transaction value",
          required: false,
          schema: { type: "number" }
        },
        {
          name: "release_date",
          in: "query",
          description: "Filter by release date (YYYY-MM-DD format)",
          required: false,
          schema: { type: "string", format: "date" }
        },
        {
          name: "recurring",
          in: "query",
          description: "Filter by recurring transactions",
          required: false,
          schema: { type: "boolean" }
        },
        {
          name: "accountName",
          in: "query",
          description: "Filter by account name",
          required: false,
          schema: { type: "string" }
        },
        {
          name: "number_installments",
          in: "query",
          description: "Filter by number of installments",
          required: false,
          schema: { type: "integer", minimum: 1 }
        },
        {
          name: "current_installment",
          in: "query",
          description: "Filter by current installment number",
          required: false,
          schema: { type: "integer", minimum: 1 }
        },
        {
          name: "paymentMethod",
          in: "query",
          description: "Filter by payment method ID",
          required: false,
          schema: { type: "integer", minimum: 1 }
        },
        {
          name: "userId",
          in: "query",
          description: "User ID (required for user transactions)",
          required: true,
          schema: { type: "integer", minimum: 1 }
        },
        {
          name: "page",
          in: "query",
          description: "Page number for pagination",
          required: false,
          schema: { type: "integer", minimum: 1, default: 1 }
        },
        {
          name: "limit",
          in: "query",
          description: "Number of items per page",
          required: false,
          schema: { type: "integer", minimum: 1, default: 10 }
        }
      ],
      responses: {
        200: commonResponses[200]("#/components/schemas/TransactionResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    post: {
      tags: ["Transactions"],
      summary: "Register a new transaction",
      description: `
        #### Use Case
        Allows the system to register a new transaction for a user with automatic installment calculation.

        #### Business Rule
        Creates a new transaction with the provided information. For installment transactions, the system automatically calculates individual installment values and provides a preview.

        #### Business Rules Involved
        - All required fields must be provided.
        - The account must exist and belong to the user.
        - The payment method must exist and be compatible with the account.
        - The user must exist.
        - Amount must be positive.
        - Payment date must be valid.
        - For installment transactions:
          * Only provide total value and number of installments
          * System calculates individual installment values automatically
          * First installment is always set as current_installment = 1
          * Last installment gets any remainder to ensure exact total
          * Response includes installmentPreview with calculated values

        #### Expected Result
        Returns the created transaction data and status 201. For installment transactions, includes a preview showing how the total value was divided across installments.
      `,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "userId",
          in: "query",
          description: "ID for user who will own the transaction",
          required: true,
          schema: { type: "integer", minimum: 1 }
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateTransactionRequest"
            }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/CreateTransactionResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/transactions/{id}": {
    patch: {
      tags: ["Transactions"],
      summary: "Update a transaction",
      description: `
        #### Use Case
        Allows the system to update information of an existing transaction.

        #### Business Rule
        Updates transaction data. All fields are optional.

        #### Business Rules Involved
        - The transaction must exist in the system.
        - The account must exist if changed.
        - The payment method must exist if changed.
        - ID must be a valid positive integer.
        - Amount must be positive if provided.
        - value_installment field stores original total for installment transactions.

        #### Expected Result
        Returns the updated transaction data and status 200.
      `,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Transaction ID",
          required: true,
          schema: { type: "integer", minimum: 1 }
        },
        {
          name: "userId",
          in: "query",
          description: "User ID for authorization",
          required: true,
          schema: { type: "integer", minimum: 1 }
        }
      ],
      requestBody: {
        required: false,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateTransactionRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/UpdateTransactionResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    delete: {
      tags: ["Transactions"],
      summary: "Remove a transaction",
      description: `
        #### Use Case
        Allows the system to remove a user transaction.

        #### Business Rule
        Removes the transaction from the system permanently.

        #### Business Rules Involved
        - The transaction must exist in the system.
        - ID must be a valid positive integer.
        - This action is irreversible.

        #### Expected Result
        Returns success message confirming transaction deletion.
      `,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of the transaction to be deleted",
          required: true,
          schema: { type: "integer", minimum: 1 }
        }
      ],
      responses: {
        200: commonResponses[200]("#/components/schemas/DeleteTransactionResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/transactions/payment-methods/{accountId}": {
    get: {
      tags: ["Transactions"],
      summary: "Get compatible payment methods for an account",
      description: `
        #### Use Case
        Retrieves all payment methods that are compatible with a specific account for transaction creation.

        #### Business Rule
        Returns payment methods that can be used with the specified account based on account-payment method relationships.

        #### Business Rules Involved
        - Account must exist in the system.
        - Only returns payment methods linked to the account.
        - User must be authenticated.

        #### Expected Result
        Returns a list of compatible payment methods for the specified account.
      `,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "accountId",
          in: "path",
          description: "ID of the account to get compatible payment methods",
          required: true,
          schema: { type: "integer", minimum: 1 }
        }
      ],
      responses: {
        200: commonResponses[200]("#/components/schemas/CompatiblePaymentMethodsResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  }
};

export default transactionRoutes;
