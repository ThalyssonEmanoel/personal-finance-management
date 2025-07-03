import commonResponses from "../schemas/swaggerCommonResponses.js";
import parameterGenerator from "../utils/parameterGenerator.js";

const usersRoutes = {
  "/users": {
    get: {
      tags: ["Users"],
      summary: "Lists all users",
      description:
        `
     #### Use Case
     Allows the system to list all registered users, with the ability to filter by specific parameters.

      #### Business Function
      Provides a paginated listing of registered users, with detailed information for each user.

       #### Business Rules Involved
       - Allow filtering by defined parameters.
       - Return an error if no users are registered.

       #### Expected Result
       Returns a paginated list of users with detailed information.`,
      security: [{ bearerAuth: [] }],
      parameters: parameterGenerator.getCustomParameters('Users', {
        excludeFields: ['Senha', 'Despesas', 'Despesas_recorrentes', 'Avatar'], //despesas foi exluído, pois acho que não é necessário
        customDescriptions: {
          id: "Filtrar por ID do usuário",
          Nome: "Filtrar por nome do usuário",
          Email: "Filtrar por email do usuário",
          Avatar: "Filtrar por avatar do usuário"
        }
      }),
      responses: {
        200: commonResponses[200]("#/components/schemas/UserResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    post: {
      tags: ["Users"],
      summary: "Register a new user",
      description: `
      #### Use Case
      Allows the system to register a new user in the application.

      #### Business Function
      Creates a new user account with the provided information, encrypting the password before storing it.

      #### Business Rules Involved
      - Email must be unique in the system.
      - Password must have at least 6 characters.
      - All required fields (Nome, Email, Senha) must be provided.
      - Avatar is optional and must be an image file (max 2MB).
      - Only image files are allowed for avatar upload.
      - Password is automatically encrypted before storage.

      #### Expected Result
      Returns the created user data (without password) and a 201 status code.`,
      requestBody: parameterGenerator.getMultipartRequestBody('Users', {
        excludeFields: ['id', 'Despesas', 'Despesas_recorrentes'],
        fileFields: ['Avatar'],
        requiredFields: ['Nome', 'Email', 'Senha'],
        title: 'CreateUserFormRequest',
        customDescriptions: {
          Nome: "Nome completo do usuário",
          Email: "Email único do usuário",
          Senha: "Senha do usuário (mínimo 8 caracteres)",
          Avatar: "Arquivo de imagem para o avatar do usuário (opcional, máximo 2MB)"
        },
        customValidations: {
          Email: { format: "email" },
          Senha: { minLength: 8 },
          Nome: { minLength: 2, maxLength: 45 }
        }
      }),
      responses: {
        201: commonResponses[201]("#/components/schemas/CreateUserResponse"),
        400: commonResponses[400](),
        409: commonResponses[409](),
        500: commonResponses[500]()
      }
    }
  },
  "/users/{id}": {
    patch: {
      tags: ["Users"],
      summary: "Update user",
      description: `
      #### Use Case
      Allows the system to update an existing user's information.

      #### Business Function
      Updates user data including name, email, password, and avatar. All fields are optional.

      #### Business Rules Involved
      - User must exist in the system.
      - Email must be unique if being updated.
      - Password must meet security requirements if being updated (8+ chars, uppercase, lowercase, number, special char).
      - Avatar file must be an image (max 2MB) if being uploaded.
      - Password is automatically encrypted before storage.
      - ID must be a valid positive integer.

      #### Expected Result
      Returns the updated user data (without password) and a 200 status code.`,
      security: [{ bearerAuth: [] }],
      parameters: parameterGenerator.getPathIdParameter("ID do usuário a ser atualizado"),
      requestBody: parameterGenerator.getMultipartRequestBody('Users', {
        excludeFields: ['id', 'Despesas', 'Despesas_recorrentes'],
        fileFields: ['Avatar'],
        requiredFields: [], // Nenhum campo obrigatório no update
        title: 'UpdateUserFormRequest',
        customDescriptions: {
          Nome: "Nome completo do usuário (opcional)",
          Email: "Email único do usuário (opcional)",
          Senha: "Nova senha do usuário (opcional, mínimo 8 caracteres)",
          Avatar: "Novo arquivo de imagem para o avatar do usuário (opcional, máximo 2MB)"
        }
      }),
      responses: {
        200: commonResponses[200]("#/components/schemas/UpdateUserResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    delete: {
      tags: ["Users"],
      summary: "Delete user",
      description: `
      #### Use Case
      Allows the system to permanently delete a user from the application.

      #### Business Function
      Removes a user account and all associated data from the system.

      #### Business Rules Involved
      - User must exist in the system.
      - ID must be a valid positive integer.
      - This action is irreversible.
      - All user data will be permanently removed.

      #### Expected Result
      Returns a success message confirming the user deletion.`,
      security: [{ bearerAuth: [] }],
      parameters: parameterGenerator.getPathIdParameter("ID do usuário a ser deletado"),
      responses: {
        204: commonResponses[204]("#/components/schemas/DeleteUserResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  }
};

export default usersRoutes;
