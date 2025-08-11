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
      "description": "Filter by goal date (will filter by the entire month)",
      "required": false,
      "schema": {
        "type": "string",
        "format": "date",
        "example": "2024-01-15"
      }
    },
    {
      "name": "userId",
      "in": "query",
      "description": "Filter by user ID (for users, this will be automatically set to their own ID)",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    },
    {
      "name": "page",
      "in": "query",
      "description": "Page number for pagination",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "default": 1
      }
    },
    {
      "name": "limit",
      "in": "query",
      "description": "Number of items per page",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 100,
        "default": 10
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

export function requestGoalPut() {
  const parameters = [
    {
      "name": "id",
      "in": "path",
      "description": "ID of the goal to update",
      "required": true,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    },
    {
      "name": "userId",
      "in": "query",
      "description": "ID of the user updating the goal",
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
              "example": "Meta de Renda Mensal Atualizada"
            },
            "date": {
              "type": "string",
              "format": "date",
              "description": "Date for the goal (month reference)",
              "example": "2024-02-15"
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
              "example": 6000.00
            }
          }
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
  // Placeholder for Swagger schema definitions if needed
  // This file primarily exports functions for request parameters
};

export default GoalRequest;
