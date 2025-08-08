import { requestPaymentMethodsGet } from "../schemas/requestMold/PaymentMethodsRequest.js";
import commonResponses from "../utils/swaggerCommonResponses.js";

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
      ...requestPaymentMethodsGet(),
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/PaymentMethodsResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    post: {
      tags: ["Payment Methods"],
      summary: "Cria um novo método de pagamento",
      description: `
        #### Caso de Uso
        Permite criar um novo método de pagamento no sistema.

        #### Regra de Negócio
        O nome do método de pagamento deve ser único no sistema.

        #### Resultado Esperado
        Retorna o método de pagamento criado com seu ID.
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
      summary: "Busca um método de pagamento por ID",
      description: `
        #### Caso de Uso
        Permite buscar um método de pagamento específico por seu ID.

        #### Regra de Negócio
        Retorna informações detalhadas do método de pagamento incluindo contadores de uso.

        #### Resultado Esperado
        Retorna os dados do método de pagamento encontrado.
      `,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID do método de pagamento",
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
      summary: "Atualiza um método de pagamento",
      description: `
        #### Caso de Uso
        Permite atualizar um método de pagamento existente.

        #### Regra de Negócio
        O nome do método de pagamento deve ser único no sistema.

        #### Resultado Esperado
        Retorna o método de pagamento atualizado.
      `,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID do método de pagamento",
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
      summary: "Deleta um método de pagamento",
      description: `
        #### Caso de Uso
        Permite deletar um método de pagamento do sistema.

        #### Regra de Negócio
        Não é possível deletar um método de pagamento que está sendo usado por contas ou transações.

        #### Resultado Esperado
        Retorna confirmação da exclusão do método de pagamento.
      `,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID do método de pagamento",
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
        200: commonResponses[200]("#/components/schemas/responseMold/AccountPaymentMethodsResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
  }
};

export default paymentMethodsRoutes;
