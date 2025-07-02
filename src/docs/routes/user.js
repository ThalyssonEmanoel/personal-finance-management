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
      - Avatar is optional.
      - Password is automatically encrypted before storage.

      #### Expected Result
      Returns the created user data (without password) and a 201 status code.`,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateUserRequest"
            }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/CreateUserResponse"),
        400: commonResponses[400](),
        409: commonResponses[409](),
        500: commonResponses[500]()
      }
    }
  },
};

export default usersRoutes;
