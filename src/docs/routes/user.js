import commonResponses from "../schemas/swaggerCommonResponses.js";
import parameterGenerator from "../utils/simpleParameterGenerator.js";

const usersRoutes = {
  "/admin/users": {
    get: {
      tags: ["Users"],
      summary: "Lists all users (Admin Only)",
      description:
        `
     ** ADMINISTRATOR ACCESS ONLY:** This endpoint can only be accessed by authenticated administrators.

     #### Use Case
     Allows system administrators to list all registered users, with the ability to filter by specific parameters.

      #### Business Function
      Provides a paginated listing of registered users, with detailed information for each user. This is an administrative operation for user management.

       #### Business Rules Involved
       - **ADMIN AUTHENTICATION REQUIRED:** Only authenticated administrators can access this endpoint.
       - Allow filtering by defined parameters.
       - Return an error if no users are registered.
       - Returns all users in the system with pagination support.

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
        403: commonResponses[403](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    post: {
      tags: ["Users"],
      summary: "Register a new user (Admin Only)",
      description: `
      ** ADMINISTRATOR ACCESS ONLY:** This endpoint can only be accessed by authenticated administrators.

      #### Use Case
      Allows system administrators to register a new user in the application through the administrative interface.

      #### Business Function
      Creates a new user account with the provided information, encrypting the password before storing it. This is an administrative operation that allows admins to create user accounts on behalf of others.

      #### Business Rules Involved
      - **ADMIN AUTHENTICATION REQUIRED:** Only authenticated administrators can access this endpoint.
      - Email must be unique in the system.
      - Password must have at least 8 characters with uppercase, lowercase, number and special character.
      - All required fields (name, email, password) must be provided.
      - Avatar is optional and must be an image file (max 2MB).
      - Only image files are allowed for avatar upload.
      - Password is automatically encrypted before storage.
      - Administrators can set the isAdmin field during user creation.
      - This endpoint bypasses normal user registration flow and is intended for administrative user management.

      #### Expected Result
      Returns the created user data (without password) and a 201 status code.`,
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/CreateUserFormRequestAdmin"
            }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/CreateUserResponseAdmin"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        403: commonResponses[403](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/admin/users/{id}": {
    patch: {
      tags: ["Users"],
      summary: "Update user (Admin Only)",
      description: `
      ** ADMINISTRATOR ACCESS ONLY:** This endpoint can only be accessed by authenticated administrators.

      #### Use Case
      Allows system administrators to update any user's information, including administrative privileges.

      #### Business Function
      Updates user data including name, email, password, avatar, and administrative status. All fields are optional. This is an administrative operation that allows admins to manage any user account in the system.

      #### Business Rules Involved
      - **ADMIN AUTHENTICATION REQUIRED:** Only authenticated administrators can access this endpoint.
      - User must exist in the system.
      - Email must be unique if being updated.
      - Password must meet security requirements if being updated (8+ chars, uppercase, lowercase, number, special char).
      - Avatar file must be an image (max 2MB) if being uploaded.
      - Password is automatically encrypted before storage.
      - ID must be a valid positive integer.
      - **EXCLUSIVE ADMIN PRIVILEGE:** Only administrators can modify the isAdmin field.
      - Administrators can update any user's information (not restricted to their own account).
      - This endpoint allows administrators to grant or revoke admin privileges to other users.

      #### Expected Result
      Returns the updated user data (without password) and a 200 status code.`,
      security: [{ bearerAuth: [] }],
      parameters: parameterGenerator.getPathIdParameter("ID do usuário a ser atualizado"),
      requestBody: {
        required: false,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/UpdateUserFormRequestAdmin"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/UpdateUserResponseAdmin"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        403: commonResponses[403](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
  },
  "/users": {
    post: {
      tags: ["Users"],
      summary: "Register a new user",
      description: `
      #### Use Case
      Allows the system to register a new user in the application.

      #### Business Function
      Creates a new user account with the provided information, encrypting the password before storing it.

      #### Business Rules Involved
      - User must be authenticated to create new users.
      - Users can only create accounts for themselves (except administrators).
      - Administrators can create accounts for others.
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
        401: commonResponses[401](),
        403: commonResponses[403](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/users/{id}": {
    get: {
      tags: ["Users"],
      summary: "Get user by ID",
      description: `
      #### Use Case
      Allows users to retrieve information about a specific user by their ID.

      #### Business Function
      Retrieves detailed information about a specific user, ensuring data privacy and access control.

      #### Business Rules Involved
      - User must be authenticated.
      - Users can ONLY access their own information (except administrators).
      - Administrators can access any user's information.
      - ID must be a valid positive integer.
      - User must exist in the system.
      - Password information is never returned for security.
      - Access is controlled by adminOrOwnerMiddleware.

      #### Expected Result
      Returns the user data (without password) and a 200 status code.`,
      security: [{ bearerAuth: [] }],
      parameters: parameterGenerator.getPathIdParameter("ID do usuário a ser consultado"),
      responses: {
        200: commonResponses[200]("#/components/schemas/UserResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        403: commonResponses[403](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    patch: {
      tags: ["Users"],
      summary: "Update user",
      description: `
      #### Use Case
      Allows the system to update an existing user's information.

      #### Business Function
      Updates user data including name, email, password, and avatar. All fields are optional.

      #### Business Rules Involved
      - User must be authenticated.
      - User must exist in the system.
      - Users can only update their own information (except administrators).
      - Administrators can update any user's information.
      - Email must be unique if being updated.
      - Password must meet security requirements if being updated (8+ chars, uppercase, lowercase, number, special char).
      - Avatar file must be an image (max 2MB) if being uploaded.
      - Password is automatically encrypted before storage.
      - ID must be a valid positive integer.
      - Only administrators can modify isAdmin field.

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
        403: commonResponses[403](),
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
      - User must be authenticated.
      - User must exist in the system.
      - Users can only delete their own account (except administrators).
      - Administrators can delete any user account.
      - ID must be a valid positive integer.
      - This action is irreversible.
      - All user data will be permanently removed including:
        - All user transactions
        - All user accounts and their payment method associations
        - User profile information
      - The deletion is performed in a database transaction to ensure data consistency.

      #### Expected Result
      Returns a success message confirming the user and all related data deletion.`,
      security: [{ bearerAuth: [] }],
      parameters: parameterGenerator.getPathIdParameter("ID do usuário a ser deletado"),
      responses: {
        200: commonResponses[200]("#/components/schemas/DeleteUserResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        403: commonResponses[403](),
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
      - Access is controlled by adminOrOwnerMiddleware to ensure users only access their own password change.

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
        403: commonResponses[403](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  }
};

export default usersRoutes;
