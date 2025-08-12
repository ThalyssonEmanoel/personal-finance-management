const GoalSchemas = {
  GoalResponse: {
    title: "GoalResponse",
    type: "object",
    properties: {
      goal: {
        type: "object",
        description: "Goal data.",
        properties: {
          id: { 
            type: "integer",
            description: "Unique identifier for the goal",
            example: 1
          },
          name: { 
            type: "string",
            description: "Name of the goal",
            example: "Meta de Renda Mensal"
          },
          date: { 
            type: "string", 
            format: "date",
            description: "Date reference for the goal (month)",
            example: "2024-01-15T00:00:00.000Z"
          },
          transaction_type: { 
            type: "string", 
            enum: ["expense", "income"],
            description: "Type of transaction the goal refers to",
            example: "income"
          },
          value: { 
            type: "number",
            format: "decimal",
            description: "Target value for the goal",
            example: 5000.00
          },
          userId: { 
            type: "integer",
            description: "ID of the user who owns the goal",
            example: 1
          },
          user: {
            type: "object",
            description: "User information",
            properties: {
              id: { 
                type: "integer",
                description: "User ID",
                example: 1
              },
              name: { 
                type: "string",
                description: "User name",
                example: "João Silva"
              },
              email: { 
                type: "string",
                format: "email",
                description: "User email",
                example: "joao@email.com"
              }
            }
          }
        }
      }
    }
  },

  GoalListResponse: {
    title: "GoalListResponse",
    type: "object",
    properties: {
      error: {
        type: "boolean",
        description: "Indicates if there was an error",
        example: false
      },
      code: {
        type: "integer",
        description: "HTTP status code",
        example: 200
      },
      message: {
        type: "string",
        description: "Response message",
        example: "Success"
      },
      page: {
        type: "integer",
        description: "Current page number",
        example: 1
      },
      data: {
        type: "array",
        description: "Array of goals",
        items: {
          type: "object",
          properties: {
            id: { 
              type: "integer",
              example: 1
            },
            name: { 
              type: "string",
              example: "Meta de Renda Mensal"
            },
            date: { 
              type: "string", 
              format: "date",
              example: "2024-01-15T00:00:00.000Z"
            },
            transaction_type: { 
              type: "string", 
              enum: ["expense", "income"],
              example: "income"
            },
            value: { 
              type: "number",
              example: 5000.00
            },
            userId: { 
              type: "integer",
              example: 1
            },
            user: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                name: { type: "string", example: "João Silva" },
                email: { type: "string", example: "joao@email.com" }
              }
            }
          }
        }
      },
      total: {
        type: "integer",
        description: "Total number of goals",
        example: 50
      },
      limite: {
        type: "integer",
        description: "Number of items per page",
        example: 10
      }
    }
  },

  GoalCreateResponse: {
    title: "GoalCreateResponse",
    type: "object",
    properties: {
      error: {
        type: "boolean",
        description: "Indicates if there was an error",
        example: false
      },
      code: {
        type: "integer",
        description: "HTTP status code",
        example: 201
      },
      message: {
        type: "string",
        description: "Response message",
        example: "Created successfully"
      },
      data: {
        type: "object",
        description: "Created goal data",
        properties: {
          id: { 
            type: "integer",
            example: 1
          },
          name: { 
            type: "string",
            example: "Meta de Renda Mensal"
          },
          date: { 
            type: "string", 
            format: "date",
            example: "2024-01-15T00:00:00.000Z"
          },
          transaction_type: { 
            type: "string", 
            enum: ["expense", "income"],
            example: "income"
          },
          value: { 
            type: "number",
            example: 5000.00
          },
          userId: { 
            type: "integer",
            example: 1
          },
          user: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              name: { type: "string", example: "João Silva" },
              email: { type: "string", example: "joao@email.com" }
            }
          }
        }
      }
    }
  },

  GoalDeleteResponse: {
    title: "GoalDeleteResponse",
    type: "object",
    properties: {
      error: {
        type: "boolean",
        description: "Indicates if there was an error",
        example: false
      },
      code: {
        type: "integer",
        description: "HTTP status code",
        example: 200
      },
      message: {
        type: "string",
        description: "Response message",
        example: "Success"
      },
      data: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Deletion confirmation message",
            example: "Meta deletada com sucesso."
          }
        }
      }
    }
  }
};

export default GoalSchemas;
