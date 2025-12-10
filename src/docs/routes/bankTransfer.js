import { requestBankTransferGet } from "../schemas/requestMold/BankTransferRequest.js";
import { requestUserId, requestWithIdAndUserId } from "../schemas/requestMold/UniversalRequest.js";
import commonResponses from "../utils/swaggerCommonResponses.js";

const bankTransferRoutes = {
  "/BankTransfer": {
    get: {
      tags: ["Bank Transfers"],
      summary: "List user bank transfers",
      description: `
        #### Use Case
        Allows the system to list all bank transfers for the authenticated user, with the possibility of filtering by specific parameters.

        #### Business Rule
        Provides a paginated listing of bank transfers belonging to the authenticated user, with detailed information for each transfer.

        #### Business Rules Involved
        - Only show transfers belonging to the authenticated user.
        - Allow filtering by defined parameters.
        - Return error if no bank transfers are found.
        - Include related data (source account, destination account, payment method).

        #### Expected Result
        Returns a paginated list of user's bank transfers with detailed information and related data.
      `,
      security: [{ bearerAuth: [] }],
      ...requestBankTransferGet(),
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/BankTransferListResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    post: {
      tags: ["Bank Transfers"],
      summary: "Create a new bank transfer",
      description: `
        #### Use Case
        Allows the system to create a new bank transfer between two accounts belonging to the same user.

        #### Business Rule
        Creates a new bank transfer with the provided information and automatically updates account balances.

        #### Business Rules Involved
        - All required fields must be provided.
        - Both source and destination accounts must exist and belong to the user.
        - Source and destination accounts must be different.
        - The payment method must exist and be compatible with the source account.
        - The user must exist.
        - Amount must be positive.
        - Transfer date must be valid.
        - Source account must have sufficient balance.
        - Account balances are automatically updated (source account debited, destination account credited).

        #### Expected Result
        Returns the created bank transfer data and status 201. Account balances are automatically adjusted.
      `,
      security: [{ bearerAuth: [] }],
      ...requestUserId(),
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/requestMold/CreateBankTransferRequest"
            }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/responseMold/CreateBankTransferResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        403: commonResponses[403](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/BankTransfer/{id}": {
    patch: {
      tags: ["Bank Transfers"],
      summary: "Update a bank transfer",
      description: `
        #### Use Case
        Allows the system to update information of an existing bank transfer.

        #### Business Rule
        Updates bank transfer data. All fields are optional. Note: This does not automatically adjust account balances.

        #### Business Rules Involved
        - The bank transfer must exist in the system and belong to the user.
        - The source and destination accounts must exist if changed.
        - The payment method must exist if changed.
        - ID must be a valid positive integer.
        - Amount must be positive if provided.
        - Source and destination accounts must be different if both are provided.

        #### Expected Result
        Returns the updated bank transfer data and status 200.
      `,
      security: [{ bearerAuth: [] }],
      ...requestWithIdAndUserId(),
      requestBody: {
        required: false,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/requestMold/UpdateBankTransferRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/UpdateBankTransferResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        403: commonResponses[403](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    delete: {
      tags: ["Bank Transfers"],
      summary: "Remove a bank transfer",
      description: `
        #### Use Case
        Allows the system to remove a user bank transfer.

        #### Business Rule
        Removes the bank transfer from the system permanently. Note: This does not automatically reverse account balance changes.

        #### Business Rules Involved
        - The bank transfer must exist in the system.
        - ID must be a valid positive integer.
        - This action is irreversible.
        - Account balances are not automatically adjusted.

        #### Expected Result
        Returns success message confirming bank transfer deletion.
      `,
      security: [{ bearerAuth: [] }],
      ...requestWithIdAndUserId(),
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/DeleteBankTransferResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
};

export default bankTransferRoutes;
