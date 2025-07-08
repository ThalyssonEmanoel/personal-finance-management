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
        excludeFields: [],
        customDescriptions: {
          id: "Filtrar por ID da conta",
          Nome: "Filtrar por nome da conta",
          Tipo: "Filtrar por tipo da conta",
          userId: "Filtrar por ID do usuário dono da conta"
        }
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
      summary: "Cadastra uma nova conta",
      description: `
        #### Caso de Uso
        Permite ao sistema cadastrar uma nova conta para um usuário.

        #### Regra de Negócio
        Cria uma nova conta com as informações fornecidas.

        #### Regras de Negócio Envolvidas
        - Todos os campos obrigatórios devem ser fornecidos.
        - O usuário dono da conta deve existir.

        #### Resultado Esperado
        Retorna os dados da conta criada e status 201.
      `,
      requestBody: parameterGenerator.getMultipartRequestBody('Accounts', {
        excludeFields: ['id'],
        fileFields: ['Icon'],
        requiredFields: ['Nome', 'Tipo'],
        title: 'CreateAccountFormRequest',
        customDescriptions: {
          Nome: "Nome completo do usuário",
          Tipo: "Tipo da conta (ex: Corrente, Poupança)",
          Saldo: "Senha do usuário (mínimo 8 caracteres)",
          Icon: "Arquivo de imagem para o ícone da conta (opcional, máximo 2MB)"
        },
      }),
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
          "application/json": {
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
