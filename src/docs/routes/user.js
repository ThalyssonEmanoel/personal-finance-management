import { requestGetId } from "../schemas/requestMold/UniversalRequest.js";
import commonResponses from "../utils/swaggerCommonResponses.js";

const usersRoutes = {
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
      - Email must be unique in the system.
      - Password must have at least 8 characters with uppercase, lowercase, number and special character.
      - All required fields (name, email, password) must be provided.
      - Avatar is optional and must be an image file (max 2MB).
      - Only image files are allowed for avatar upload.
      - Password is automatically encrypted before storage.

      #### Expected Result
      Returns the created user data (without password) and a 201 status code.`,
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/requestMold/CreateUserFormRequest"
            }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/responseMold/CreateUserResponse"),
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
      - ID must be a valid positive integer.
      - User must exist in the system.
      - Password information is never returned for security.

      #### Expected Result
      Returns the user data (without password) and a 200 status code.`,
      security: [{ bearerAuth: [] }],
      ...requestGetId(),
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/UserResponse"),
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
      - Email must be unique if being updated.
      - Password must meet security requirements if being updated (8+ chars, uppercase, lowercase, number, special char).
      - Avatar file must be an image (max 2MB) if being uploaded.
      - Password is automatically encrypted before storage.
      - ID must be a valid positive integer.

      #### Expected Result
      Returns the updated user data (without password) and a 200 status code.`,
      security: [{ bearerAuth: [] }],
      ...requestGetId(),
      requestBody: {
        required: false,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/requestMold/UpdateUserFormRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/UpdateUserResponse"),
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
        ...requestGetId(),
        responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/DeleteUserResponse"),
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
      - Current password must be provided and must be correct.
      - New password must meet security requirements (8+ chars, uppercase, lowercase, number, special char).
      - New password and confirmation password must match.
      - ID must be a valid positive integer.
      - No user can change another user's password through this endpoint.

      #### Expected Result
      Returns a success message confirming the password change.`,
      security: [{ bearerAuth: [] }],
      ...requestGetId(),
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/requestMold/ChangePasswordRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/ChangePasswordResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        403: commonResponses[403](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
};

export default usersRoutes;
