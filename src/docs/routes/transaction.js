import commonResponses from "../schemas/swaggerCommonResponses.js";
import parameterGenerator from "../utils/parameterGenerator.js";

const transactionRoutes = {
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
      parameters: parameterGenerator.getCustomParameters('Transacoes', {
        excludeFields: ['conta', 'formaPagamento', 'usuario'],
        customDescriptions: {
          id: "Filter by transaction ID",
          tipo: "Filter by transaction type (despesa or receita)",
          nome: "Filter by transaction name",
          categoria: "Filter by transaction category",
          subcategoria: "Filter by transaction subcategory",
          valor: "Filter by transaction amount",
          data_pagamento: "Filter by payment date (YYYY-MM-DD format)",
          dia_cobranca: "Filter by billing day",
          quantidade_parcelas: "Filter by number of installments",
          recorrente: "Filter by recurring transactions (true/false)",
          contaId: "Filter by account ID",
          formaPagamentoId: "Filter by payment method ID",
          userId: "Filter by user ID"
        }
      }),
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
        Allows the system to register a new transaction for a user.

        #### Business Rule
        Creates a new transaction with the provided information.

        #### Business Rules Involved
        - All required fields must be provided.
        - The account must exist and belong to the user.
        - The payment method must exist.
        - The user must exist.
        - Amount must be positive.
        - Payment date must be valid.

        #### Expected Result
        Returns the created transaction data and status 201.
      `,
      security: [{ bearerAuth: [] }],
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

        #### Expected Result
        Returns the updated transaction data and status 200.
      `,
      security: [{ bearerAuth: [] }],
      parameters: parameterGenerator.getPathIdParameter("ID of the transaction to be updated"),
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
      parameters: parameterGenerator.getPathIdParameter("ID of the transaction to be deleted"),
      responses: {
        200: commonResponses[200]("#/components/schemas/DeleteTransactionResponse"),
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
