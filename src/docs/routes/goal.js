import { requestGoalGet, requestGoalPost } from "../schemas/requestMold/GoalRequest.js";
import { requestGetId, requestUserId, requestWithIdAndUserId } from "../schemas/requestMold/UniversalRequest.js";
import commonResponses from "../utils/swaggerCommonResponses.js";

const goalRoutes = {
  "/goals": {
    get: {
      tags: ["Goals"],
      summary: "List user goals",
      description: `
        #### Use Case
        Allows users to list their own registered goals, with the possibility of filtering by specific parameters.

        #### Business Rule
        Provides a complete listing of user's goals (no pagination), with detailed information for each goal.

        #### Business Rules Involved
        - User can only see their own goals.
        - userId parameter is required for security.
        - Allow filtering by defined parameters.
        - Date filter works annually: from the specified month until the end of the year.
        - Returns all matching results without pagination limits.
        - Return error if no goals are registered.
        - Include related user data.

        #### Expected Result
        Returns a complete list of user's goals with detailed information, filtered by the specified criteria.

        #### Date Filter Examples
        - date=2025-01-01: Returns goals from January to December 2025
        - date=2025-06-15: Returns goals from June to December 2025
        - date=2025-12-01: Returns goals for December 2025 only
      `,
      security: [{ bearerAuth: [] }],
      ...requestGoalGet(),
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/GoalListResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        403: commonResponses[403](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    post: {
      tags: ["Goals"],
      summary: "Create a new goal",
      description: `
        #### Use Case
        Allows users to create a new financial goal for a specific month and transaction type.

        #### Business Rule
        Creates a new goal with the provided information, ensuring no duplicate goals exist for the same transaction type in the same month.

        #### Business Rules Involved
        - User can only create goals for themselves.
        - Only one goal per transaction type per month is allowed.
        - Date, name, transaction type and value are required.
        - Transaction type must be either 'income' or 'expense'.

        #### Expected Result
        Returns the created goal with detailed information and related user data.
      `,
      security: [{ bearerAuth: [] }],
      ...requestGoalPost(),
      responses: {
        201: commonResponses[201]("#/components/schemas/responseMold/GoalCreateResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/goals/{id}": {
    patch: {
      tags: ["Goals"],
      summary: "Update a goal",
      description: `
        #### Use Case
        Allows users to update an existing goal.

        #### Business Rule
        Updates the goal with the provided information, ensuring no conflicts with existing goals.

        #### Business Rules Involved
        - User can only update their own goals.
        - Goal must exist.
        - If changing date or transaction type, ensure no conflicts with existing goals.
        - All fields are optional for update.

        #### Expected Result
        Returns the updated goal with detailed information and related user data.
      `,
      security: [{ bearerAuth: [] }],
      ...requestWithIdAndUserId(),
      requestBody: {
        required: false,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/requestMold/UpdateGoalRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/GoalResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    delete: {
      tags: ["Goals"],
      summary: "Delete a goal",
      description: `
        #### Use Case
        Allows users to delete an existing goal.

        #### Business Rule
        Removes the goal from the system permanently.

        #### Business Rules Involved
        - User can only delete their own goals.
        - Goal must exist.
        - Deletion is permanent and cannot be undone.

        #### Expected Result
        Returns a confirmation message of successful deletion.
      `,
      security: [{ bearerAuth: [] }],
      ...requestWithIdAndUserId(),
      responses: {
        200: commonResponses[200]("#/components/schemas/responseMold/GoalDeleteResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
};

export default goalRoutes;
