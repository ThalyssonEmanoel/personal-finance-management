import { requestTransactionGet, requestTransactionPdf } from "../schemas/requestMold/TransactionRequest.js";
import { requestGetId, requestUserId, requestWithIdAndUserId } from "../schemas/requestMold/UniversalRequest.js";
import commonResponses from "../utils/swaggerCommonResponses.js";

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
      ...requestTransactionGet(),
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/TransactionResponse"),
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
      ...requestTransactionGet(),
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/TransactionResponse"),
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
      ...requestUserId(),
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/requestMold/CreateTransactionRequest"
            }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/responseMold/CreateTransactionResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/transactions/download": {
    get: {
      tags: ["Transactions"],
      summary: "Download transaction statement PDF",
      description: `
        #### Use Case
        Allows users to download a PDF statement of their transactions for a specific period.

        #### Business Rule
        Generates and downloads a PDF file containing transaction details for the specified date range and type.

        #### Business Rules Involved
        - User can only download statements for their own transactions.
        - All parameters (userId, startDate, endDate, type) are required.
        - Date range must be valid.
        - Type can be 'all', 'income', or 'expense'.
        - Returns error if no transactions found for the period.

        #### Expected Result
        Returns a PDF file with transaction statement for download.
      `,
      security: [{ bearerAuth: [] }],
      ...requestTransactionPdf(),
      responses: {
        200: commonResponses[200](),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
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
      ...requestWithIdAndUserId(),
      requestBody: {
        required: false,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/requestMold/UpdateTransactionRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/UpdateTransactionResponse"),
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
      ...requestWithIdAndUserId(),
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/DeleteTransactionResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
};

export default transactionRoutes;
