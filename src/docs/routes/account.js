import commonResponses from "../schemas/swaggerCommonResponses.js";
import parameterGenerator from "../utils/simpleParameterGenerator.js";

const accountsRoutes = {
  "/admin/account": {
    get: {
      tags: ["Accounts"],
      summary: "Lista todas as contas (Admin Only)",
      description: `
        ** ADMINISTRATOR ACCESS ONLY:** This endpoint can only be accessed by authenticated administrators.

        #### Caso de Uso
        Permite a administradores do sistema listar todas as contas cadastradas, com possibilidade de filtro por parâmetros específicos.

        #### Regra de Negócio
        Fornece uma listagem paginada das contas cadastradas, com informações detalhadas de cada conta. Esta é uma operação administrativa para gerenciamento de contas.

        #### Regras de Negócio Envolvidas
        - **ADMIN AUTHENTICATION REQUIRED:** Apenas administradores autenticados podem acessar este endpoint.
        - Permitir filtragem por parâmetros definidos.
        - Retornar erro caso não haja contas cadastradas.
        - Retorna todas as contas do sistema com suporte a paginação.

        #### Resultado Esperado
        Retorna uma lista paginada de contas com informações detalhadas.
      `,
      security: [{ bearerAuth: [] }],
      parameters: parameterGenerator.getCustomParameters('Accounts', {
        excludeFields: ['icon', 'user', 'transactions', 'userId'],
        customDescriptions: {
          id: "Filtrar por ID da conta",
          name: "Filtrar por nome da conta",
          type: "Filtrar por tipo da conta"
        },
        extraParameters: [
          {
            name: "userId",
            in: "query",
            description: "Filtrar por ID do usuário dono da conta",
            required: false,
            schema: { type: "integer" }
          }
        ]
      }),
      responses: {
        200: commonResponses[200]("#/components/schemas/AccountResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        403: commonResponses[403](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/account": {
    post: {
      tags: ["Accounts"],
      summary: "Register a new account",
      description: `
        #### Use Case
        Allows users to register a new account for themselves.

        #### Business Rule
        Creates a new account with the provided information. Users can only create accounts for themselves.

        #### Business Rules Involved
        - User must be authenticated.
        - Users can ONLY create accounts for themselves (except administrators).
        - Administrators can create accounts for any user.
        - All required fields must be provided.
        - The userId must be passed as a query parameter.
        - Access is controlled by adminOrOwnerMiddleware.

        #### Expected Result
        Returns the created account data and status 201.
      `,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "userId",
          in: "query",
          description: "ID do usuário para quem a conta será criada",
          required: true,
          schema: { type: "integer", minimum: 1 }
        }
      ],
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
        401: commonResponses[401](),
        403: commonResponses[403](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/account/{id}": {
    get: {
      tags: ["Accounts"],
      summary: "Get account by ID",
      description: `
        #### Use Case
        Allows users to retrieve information about a specific account by its ID.

        #### Business Rule
        Retrieves detailed information about a specific account, ensuring data privacy and access control.

        #### Business Rules Involved
        - User must be authenticated.
        - Users can ONLY access accounts that belong to them (except administrators).
        - Administrators can access any account information.
        - ID must be a valid positive integer.
        - Account must exist in the system.
        - Access is controlled by adminOrOwnerMiddleware.

        #### Expected Result
        Returns the account data and a 200 status code.
      `,
      security: [{ bearerAuth: [] }],
      parameters: parameterGenerator.getCustomParameters('Accounts', {
        excludeFields: ['icon', 'user', 'transactions', 'userId'],
        customDescriptions: {
          id: "Filtrar por ID da conta",
          name: "Filtrar por nome da conta",
          type: "Filtrar por tipo da conta"
        },
        extraParameters: [
          {
            name: "userId",
            in: "query",
            description: "Filtrar por ID do usuário dono da conta",
            required: false,
            schema: { type: "integer" }
          }
        ]
      }),
      responses: {
        200: commonResponses[200]("#/components/schemas/AccountResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        403: commonResponses[403](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
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
      parameters: parameterGenerator.getQueryIdAndUserParameter("ID da conta a ser deletada"),
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
        403: commonResponses[403](),
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
      parameters: parameterGenerator.getQueryIdAndUserParameter("ID da conta a ser deletada"),
      responses: {
        200: commonResponses[200]("#/components/schemas/DeleteAccountResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        403: commonResponses[403](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  }
};

export default accountsRoutes;
