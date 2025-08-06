import commonResponses from "../schemas/swaggerCommonResponses.js";
import parameterGenerator from "../utils/simpleParameterGenerator.js";

const accountPaymentMethodsRoutes = {
  "/account-payment-methods": {
    get: {
      tags: ["Account Payment Methods"],
      summary: "Lista relacionamentos entre contas e métodos de pagamento",
      description: `
        #### Caso de Uso
        Permite listar todos os relacionamentos entre contas e métodos de pagamento.

        #### Regra de Negócio
        Mostra quais métodos de pagamento estão disponíveis para cada conta.

        #### Resultado Esperado
        Retorna uma lista paginada dos relacionamentos com informações das contas, métodos de pagamento e usuários.
      `,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "query",
          description: "Filtrar por ID do relacionamento",
          required: false,
          schema: { type: "integer" }
        },
        {
          name: "accountId",
          in: "query",
          description: "Filtrar por ID da conta",
          required: false,
          schema: { type: "integer" }
        },
        {
          name: "paymentMethodId",
          in: "query",
          description: "Filtrar por ID do método de pagamento",
          required: false,
          schema: { type: "integer" }
        },
        {
          name: "accountName",
          in: "query",
          description: "Filtrar por nome da conta",
          required: false,
          schema: { type: "string" }
        },
        {
          name: "paymentMethodName",
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
        200: commonResponses[200]("#/components/schemas/AccountPaymentMethodsResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  }
};

export default accountPaymentMethodsRoutes;
