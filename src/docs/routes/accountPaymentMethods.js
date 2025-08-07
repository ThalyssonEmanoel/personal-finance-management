import commonResponses from "../utils/swaggerCommonResponses.js";

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
        200: commonResponses[200]("#/components/schemas/responseMold/AccountPaymentMethodsResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    post: {
      tags: ["Account Payment Methods"],
      summary: "Cria um novo relacionamento entre conta e método de pagamento",
      description: `
        #### Caso de Uso
        Permite criar um novo relacionamento entre uma conta e um método de pagamento.

        #### Regra de Negócio
        O relacionamento entre uma conta e método de pagamento deve ser único.

        #### Resultado Esperado
        Retorna o relacionamento criado com seu ID.
      `,
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/requestMold/CreateAccountPaymentMethodRequest"
            }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/responseMold/CreateAccountPaymentMethodResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/account-payment-methods/{id}": {
    get: {
      tags: ["Account Payment Methods"],
      summary: "Busca um relacionamento por ID",
      description: `
        #### Caso de Uso
        Permite buscar um relacionamento específico entre conta e método de pagamento por seu ID.

        #### Regra de Negócio
        Retorna informações detalhadas do relacionamento incluindo dados da conta e método de pagamento.

        #### Resultado Esperado
        Retorna os dados do relacionamento encontrado.
      `,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID do relacionamento",
          required: true,
          schema: { type: "integer", minimum: 1 }
        }
      ],
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/AccountPaymentMethodResponseGet"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    put: {
      tags: ["Account Payment Methods"],
      summary: "Atualiza um relacionamento entre conta e método de pagamento",
      description: `
        #### Caso de Uso
        Permite atualizar um relacionamento existente entre conta e método de pagamento.

        #### Regra de Negócio
        O relacionamento atualizado deve continuar sendo único.

        #### Resultado Esperado
        Retorna o relacionamento atualizado.
      `,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID do relacionamento",
          required: true,
          schema: { type: "integer", minimum: 1 }
        }
      ],
      requestBody: {
        required: false,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/requestMold/UpdateAccountPaymentMethodRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/UpdateAccountPaymentMethodResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    delete: {
      tags: ["Account Payment Methods"],
      summary: "Deleta um relacionamento entre conta e método de pagamento",
      description: `
        #### Caso de Uso
        Permite deletar um relacionamento entre conta e método de pagamento.

        #### Regra de Negócio
        Não é possível deletar um relacionamento que está sendo usado por transações.

        #### Resultado Esperado
        Retorna confirmação da exclusão do relacionamento.
      `,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID do relacionamento",
          required: true,
          schema: { type: "integer", minimum: 1 }
        }
      ],
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/DeleteAccountPaymentMethodResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  }
};

export default accountPaymentMethodsRoutes;
