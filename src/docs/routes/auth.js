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
              $ref: "#/components/schemas/LoginRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/LoginResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        500: commonResponses[500]()
      }
    }
  }
};

export default authRoutes;