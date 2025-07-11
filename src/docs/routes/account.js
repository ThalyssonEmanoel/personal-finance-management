import commonResponses from "../schemas/swaggerCommonResponses.js";
import parameterGenerator from "../utils/parameterGenerator.js";

const accountsRoutes = {
  "/account": {
    get: {
      tags: ["Accounts"],
      summary: "Lista todas as contas",
      description: `
        #### Caso de Uso
        Permite ao sistema listar todas as contas cadastradas, com possibilidade de filtro por parâmetros específicos.

        #### Regra de Negócio
        Fornece uma listagem paginada das contas cadastradas, com informações detalhadas de cada conta.

        #### Regras de Negócio Envolvidas
        - Permitir filtragem por parâmetros definidos.
        - Retornar erro caso não haja contas cadastradas.

        #### Resultado Esperado
        Retorna uma lista paginada de contas com informações detalhadas.
      `,
      security: [{ bearerAuth: [] }],
      parameters: parameterGenerator.getCustomParameters('Accounts', {
        excludeFields: ['icon', 'usuario', 'transacoes', 'userId'],
        customDescriptions: {
          id: "Filtrar por ID da conta",
          name: "Filtrar por nome da conta",
          type: "Filtrar por tipo da conta"
        },
        extraParameters: [
          {
            name: "userName",
            in: "query",
            description: "Filtrar por nome do usuário dono da conta",
            required: false,
            schema: { type: "string" }
          }
        ]
      }),
      responses: {
        200: commonResponses[200]("#/components/schemas/AccountResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    post: {
      tags: ["Accounts"],
      summary: "Register a new account",
      description: `
        #### Use Case
        Allows the system to register a new account for a user.

        #### Business Rule
        Creates a new account with the provided information.

        #### Business Rules Involved
        - All required fields must be provided.
        - The account owner user must exist.

        #### Expected Result
        Returns the created account data and status 201.
      `,
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/CreateAccountFormRequest"
            }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/CreateAccountResponse"),
        400: commonResponses[400](),
        409: commonResponses[409](),
        500: commonResponses[500]()
      }
    }
  },
  "/account/{id}": {
    patch: {
      tags: ["Accounts"],
      summary: "Atualiza uma conta",
      description: `
        #### Caso de Uso
        Permite ao sistema atualizar as informações de uma conta existente.

        #### Regra de Negócio
        Atualiza os dados da conta. Todos os campos são opcionais.

        #### Regras de Negócio Envolvidas
        - A conta deve existir no sistema.
        - O usuário dono da conta deve existir se for alterado.
        - ID deve ser um inteiro positivo válido.

        #### Resultado Esperado
        Retorna os dados da conta atualizada e status 200.
      `,
      security: [{ bearerAuth: [] }],
      parameters: parameterGenerator.getPathIdParameter("ID da conta a ser atualizada"),
      requestBody: {
        required: false,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/UpdateAccountFormRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/UpdateAccountResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    delete: {
      tags: ["Accounts"],
      summary: "Remove uma conta",
      description: `
        #### Caso de Uso
        Permite ao sistema remover uma conta do usuário.

        #### Regra de Negócio
        Remove a conta do sistema de forma permanente.

        #### Regras de Negócio Envolvidas
        - A conta deve existir no sistema.
        - ID deve ser um inteiro positivo válido.
        - Esta ação é irreversível.

        #### Resultado Esperado
        Retorna mensagem de sucesso confirmando a exclusão da conta.
      `,
      security: [{ bearerAuth: [] }],
      parameters: parameterGenerator.getPathIdParameter("ID da conta a ser deletada"),
      responses: {
        200: commonResponses[200]("#/components/schemas/DeleteAccountResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  }
};

export default accountsRoutes;
