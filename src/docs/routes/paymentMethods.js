import commonResponses from "../schemas/swaggerCommonResponses.js";
import parameterGenerator from "../utils/parameterGenerator.js";

const paymentMethodsRoutes = {
  "/payment-methods": {
    get: {
      tags: ["Payment Methods"],
      summary: "Lista todos os métodos de pagamento",
      description: `
        #### Caso de Uso
        Permite listar todos os métodos de pagamento cadastrados no sistema.

        #### Regra de Negócio
        Fornece uma listagem paginada dos métodos de pagamento com contadores de uso.

        #### Resultado Esperado
        Retorna uma lista paginada de métodos de pagamento com informações de quantas contas e transações usam cada método.
      `,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "query",
          description: "Filtrar por ID do método de pagamento",
          required: false,
          schema: { type: "integer" }
        },
        {
          name: "name",
          in: "query",
          description: "Filtrar por nome do método de pagamento",
          required: false,
          schema: { type: "string" }
        },
        {
          name: "page",
          in: "query",
          description: "Número da página",
          required: false,
          schema: { type: "integer", default: 1 }
        },
        {
          name: "limit",
          in: "query",
          description: "Limite de itens por página",
          required: false,
          schema: { type: "integer", default: 10 }
        }
      ],
      responses: {
        200: commonResponses[200]("#/components/schemas/PaymentMethodsResponse"),
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
