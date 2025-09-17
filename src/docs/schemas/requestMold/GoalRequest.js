export function requestGoalGet() {
  const parameters = [
    {
      "name": "name",
      "in": "query",
      "description": "Filter by goal name",
      "required": false,
      "schema": { "type": "string" }
    },
    {
      "name": "transaction_type",
      "in": "query",
      "description": "Filter by transaction type",
      "required": false,
      "schema": {
        "type": "string",
        "enum": ["expense", "income"]
      }
    },
    {
      "name": "date",
      "in": "query",
      "description": "Filter by goal date (annual filter: from the specified month until the end of the year). Format: YYYY-MM-DD",
      "required": false,
      "schema": {
        "type": "string",
        "format": "date",
        "example": "2025-02-01"
      }
    },
    {
      "name": "userId",
      "in": "query",
      "description": "User ID (required - users can only access their own goals)",
      "required": true,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    },
    {
      "name": "page",
      "in": "query",
      "description": "Page number for pagination (optional - if not provided, returns all results)",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "example": 1
      }
    },
    {
      "name": "limit",
      "in": "query",
      "description": "Number of items per page (optional - required only when page is provided, max: 100)",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 100,
        "example": 10
      }
    }
  ];

  return { parameters };
}

export function requestGoalPost() {
  const parameters = [
    {
      "name": "userId",
      "in": "query",
      "description": "ID of the user creating the goal",
      "required": true,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    }
  ];

  const requestBody = {
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "Name of the goal",
              "example": "Meta de Renda Mensal"
            },
            "date": {
              "type": "string",
              "format": "date",
              "description": "Date for the goal (month reference)",
              "example": "2024-01-15"
            },
            "transaction_type": {
              "type": "string",
              "enum": ["expense", "income"],
              "description": "Type of transaction for the goal",
              "example": "income"
            },
            "value": {
              "type": "number",
              "format": "float",
              "minimum": 0.01,
              "description": "Target value for the goal",
              "example": 5000.00
            }
          },
          "required": ["name", "date", "transaction_type", "value"]
        }
      }
    }
  };

  return { parameters, requestBody };
}


export function requestGoalsByMonth() {
  const parameters = [
    {
      "name": "userId",
      "in": "query",
      "description": "ID of the user",
      "required": true,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    },
    {
      "name": "year",
      "in": "query",
      "description": "Year for filtering goals",
      "required": true,
      "schema": {
        "type": "integer",
        "minimum": 1900,
        "maximum": 2100,
        "example": 2024
      }
    },
    {
      "name": "month",
      "in": "query",
      "description": "Month for filtering goals (1-12)",
      "required": true,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 12,
        "example": 1
      }
    }
  ];
  
  return { parameters };
}
const GoalRequest = {
  UpdateGoalRequest: {
    title: "UpdateGoalRequest",
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the goal",
        example: "Meta de Renda Mensal"
      },
      date: {
        type: "string",
        format: "date",
        description: "Goal date",
        example: "2025-08-12"
      },
      transaction_type: {
        type: "string",
        nullable: true,
        description: "Type of transaction for the goal",
        example: "income"
      },
      value: {
        type: "integer",
        description: "Target value for the goal",
        example: 5000
      },
    },
    description: "Schema for updating a goal.",
    example: {
      name: "Updated Goal Name",
      date: "2025-08-12",
      transaction_type: "income",
      value: 7500
    }
  },
};

export default GoalRequest;
