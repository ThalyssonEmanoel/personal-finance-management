import { requestAccountPaymentMethodsGet, requestPaymentMethodsGet } from "../schemas/requestMold/PaymentMethodsRequest.js";
import commonResponses from "../utils/swaggerCommonResponses.js";

const paymentMethodsRoutes = {
  "/payment-methods": {
    get: {
      tags: ["Payment Methods"],
      summary: "Lists all payment methods (Admin Only)",
      description: `
        #### Use Case
        Allows listing all registered payment methods in the system.

        #### Business Rule
        Provides a paginated list of payment methods with usage counters.

        #### Expected Result
        Returns a paginated list of payment methods with information about how many accounts and transactions use each method.
      `,
      security: [{ bearerAuth: [] }],
      ...requestPaymentMethodsGet(),
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/PaymentMethodResponseGet"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    post: {
      tags: ["Payment Methods"],
      summary: "Creates a new payment method (Admin Only)",
      description: `
        #### Use Case
        Allows creating a new payment method in the system.

        #### Business Rule
        The name of the payment method must be unique in the system.

        #### Expected Result
        Returns the created payment method with its ID.
      `,
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/requestMold/CreatePaymentMethodRequest"
            }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/responseMold/CreatePaymentMethodResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/payment-methods/{id}": {
    get: {
      tags: ["Payment Methods"],
      summary: "Fetch a payment method by ID (Admin Only)",
      description: `
        #### Use Case
        Allows fetching a specific payment method by its ID.

        #### Business Rule
        Returns detailed information about the payment method including usage counters.

        #### Expected Result
        Returns the data of the found payment method.
      `,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of the payment method",
          required: true,
          schema: { type: "integer", minimum: 1 }
        }
      ],
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/PaymentMethodResponseGet"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    patch: {
      tags: ["Payment Methods"],
      summary: "Update a payment method (Admin Only)",
      description: `
        #### Use Case
        Allows updating an existing payment method.

        #### Business Rule
        The name of the payment method must be unique in the system.

        #### Expected Result
        Returns the updated payment method.
      `,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of the payment method",
          required: true,
          schema: { type: "integer", minimum: 1 }
        }
      ],
      requestBody: {
        required: false,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/requestMold/UpdatePaymentMethodRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/UpdatePaymentMethodResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    delete: {
      tags: ["Payment Methods"],
      summary: "Delete a payment method (Admin Only)",
      description: `
        #### Use Case
        Allows deleting a payment method from the system.

        #### Business Rule
        It is not possible to delete a payment method that is being used by accounts or transactions.

        #### Expected Result
        Returns confirmation of the deletion of the payment method.
      `,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of the payment method",
          required: true,
          schema: { type: "integer", minimum: 1 }
        }
      ],
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/DeletePaymentMethodResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/account-payment-methods": {
    get: {
      tags: ["Payment Methods"],
      summary: "List relationships between accounts and payment methods (Admin Only)",
      description: `
        #### Use Case
        Allows listing all relationships between accounts and payment methods.

        #### Business Rule
        Shows which payment methods are available for each account.

        #### Expected Result
        Returns a paginated list of relationships with information about the accounts, payment methods, and users.
      `,
      security: [{ bearerAuth: [] }],
      ...requestAccountPaymentMethodsGet(),
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/AccountPaymentMethodsResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  }
};

export default paymentMethodsRoutes;
