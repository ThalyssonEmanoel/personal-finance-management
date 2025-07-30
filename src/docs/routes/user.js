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
       - Administrators can see all users.
       - Regular users can only see their own information.

       #### Expected Result
       Returns a paginated list of users with detailed information.`,
      security: [{ bearerAuth: [] }],
      parameters: parameterGenerator.getCustomParameters('Users', {
        excludeFields: ['password', 'Despesas', 'Despesas_recorrentes', 'avatar', 'refreshToken', 'Text', 'transactions'], //despesas foi exluído, pois acho que não é necessário
        customDescriptions: {
          id: "Filtrar por ID do usuário",
          name: "Filtrar por nome do usuário",
          email: "Filtrar por email do usuário",
          avatar: "Filtrar por avatar do usuário"
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
      - Password must have at least 8 characters with uppercase, lowercase, number and special character.
      - All required fields (name, email, password) must be provided.
      - Avatar is optional and must be an image file (max 2MB).
      - Only image files are allowed for avatar upload.
      - Password is automatically encrypted before storage.
      - New users are always created with isAdmin set to false.
      - The isAdmin field cannot be set during user creation.

      #### Expected Result
      Returns the created user data (without password) and a 201 status code.`,
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/CreateUserFormRequest"
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
      - Only administrators can modify isAdmin field.
      - Users can only update their own information (except administrators).

      #### Expected Result
      Returns the updated user data (without password) and a 200 status code.`,
      security: [{ bearerAuth: [] }],
      parameters: parameterGenerator.getPathIdParameter("ID do usuário a ser atualizado"),
      requestBody: {
        required: false,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/UpdateUserFormRequest"
            }
          }
        }
      },
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
      - All user data will be permanently removed including:
        - All user transactions
        - All user accounts and their payment method associations
        - User profile information
      - Users can only delete their own account (except administrators).
      - The deletion is performed in a database transaction to ensure data consistency.

      #### Expected Result
      Returns a success message confirming the user and all related data deletion.`,
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
  },
  "/users/{id}/change-password": {
    patch: {
      tags: ["Users"],
      summary: "Change user password",
      description: `
      #### Use Case
      Allows a user to change their own password.

      #### Business Function
      Updates the user's password after validating the current password and ensuring the new password meets security requirements.

      #### Business Rules Involved
      - User must be authenticated.
      - User can ONLY change their own password (including administrators).
      - Current password must be provided and must be correct.
      - New password must meet security requirements (8+ chars, uppercase, lowercase, number, special char).
      - New password and confirmation password must match.
      - ID must be a valid positive integer.
      - No user can change another user's password through this endpoint.

      #### Expected Result
      Returns a success message confirming the password change.`,
      security: [{ bearerAuth: [] }],
      parameters: parameterGenerator.getPathIdParameter("ID do usuário que deseja alterar a senha"),
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ChangePasswordRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/ChangePasswordResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        403: {
          description: "Forbidden - User can only change their own password",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "boolean", example: true },
                  code: { type: "integer", example: 403 },
                  message: { type: "string", example: "Você só pode alterar sua própria senha." }
                }
              }
            }
          }
        },
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  }
};

export default usersRoutes;
