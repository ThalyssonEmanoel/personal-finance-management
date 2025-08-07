import commonResponses from "../schemas/swaggerCommonResponses.js";

const authRoutes = {
  "/login": {
    post: {
      tags: ["Auth"],
      summary: "User authentication",
      description: `
      #### Use Case
      Allows users to authenticate in the system using email and password.

      #### Business Function
      Validates user credentials and returns JWT tokens for access control and session management.

      #### Business Rules Involved
      - Email and password are required fields.
      - Email must be in valid format.
      - Password must not be empty.
      - Returns access token with short expiration (15 minutes by default).
      - Returns refresh token with long expiration (7 days by default).
      - User password is not returned in response for security.
      - Refresh token is stored in database for session management.

      #### Expected Result
      Returns access token, refresh token, and user data (without password) on successful authentication.`,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/requestMold/LoginRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/LoginResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        500: commonResponses[500]()
      }
    }
  },
  "/logout": {
    post: {
      tags: ["Auth"],
      summary: "User logout",
      description: `
      #### Use Case
      Allows authenticated users to logout from the system by invalidating their refresh token.

      #### Business Function
      Invalidates the user's refresh token, effectively logging them out from the system and preventing token refresh.

      #### Business Rules Involved
      - User must be authenticated (valid access token required).
      - User ID is required in request body.
      - User must exist in the system.
      - User must have an active refresh token.
      - Sets refresh token to null in database.
      - Returns success message on successful logout.

      #### Expected Result
      Successfully invalidates user session by removing refresh token and returns success confirmation.`,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/requestMold/LogoutRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/LogoutResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        500: commonResponses[500]()
      }
    }
  },
  "/refresh-token": {
    post: {
      tags: ["Auth"],
      summary: "Refresh access token",
      description: `
      #### Use Case
      Allows users to obtain a new access token using a valid refresh token when the current access token has expired.

      #### Business Function
      Validates the provided refresh token and generates new access and refresh tokens, extending the user's session.

      #### Business Rules Involved
      - Refresh token is required and must be valid.
      - Refresh token must not be expired.
      - User associated with the token must still exist.
      - Refresh token in database must match the provided token.
      - Generates new access token with short expiration (15 minutes by default).
      - Refresh token remains the same (not rotated).
      - No database update needed since refresh token is maintained.

      #### Expected Result
      Returns new access token and the same refresh token on successful validation.`,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/requestMold/RefreshTokenRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/RefreshTokenResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        500: commonResponses[500]()
      }
    }
  },
  "/revoke-token": {
    post: {
      tags: ["Auth"],
      summary: "Revoke user tokens",
      description: `
      #### Use Case
      Allows authenticated users or administrators to revoke all tokens for a specific user, effectively logging them out from all devices.

      #### Business Function
      Invalidates all tokens for a user by removing their refresh token from the database, forcing re-authentication.

      #### Business Rules Involved
      - User must be authenticated (valid access token required).
      - User ID is required in request body.
      - Target user must exist in the system.
      - Removes refresh token from database.
      - User will need to login again to get new tokens.
      - Can be used for security purposes (compromised account, etc.).

      #### Expected Result
      Successfully revokes all user tokens and returns confirmation message.`,
      security: [
        {
          bearerAuth: []
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/requestMold/RevokeTokenRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/RevokeTokenResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        500: commonResponses[500]()
      }
    }
  }
};

export default authRoutes;