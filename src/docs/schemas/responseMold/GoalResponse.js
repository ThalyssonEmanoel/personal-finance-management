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
            type: "string",
            description: "Target value for the goal",
            example: "5000.00"
          },
          incomeTotal: {
            type: "string",
            description: "Total amount of income transactions in the same month as the goal (only present for income goals)",
            example: "4500.50"
          },
          expenseTotal: {
            type: "string", 
            description: "Total amount of expense transactions in the same month as the goal (only present for expense goals)",
            example: "3200.75"
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
      data: {
        type: "array",
        description: "Array of all goals matching the criteria (no pagination)",
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
              example: "2025-01-15T00:00:00.000Z"
            },
            transaction_type: { 
              type: "string", 
              enum: ["expense", "income"],
              example: "income"
            },
            value: { 
              type: "string",
              example: "5000.00"
            },
            incomeTotal: {
              type: "string",
              description: "Total amount of income transactions in the same month as the goal (only present for income goals)",
              example: "4500.50"
            },
            expenseTotal: {
              type: "string", 
              description: "Total amount of expense transactions in the same month as the goal (only present for expense goals)",
              example: "3200.75"
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
        description: "Total number of goals returned",
        example: 12
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
            type: "string",
            example: "5000.00"
          },
          incomeTotal: {
            type: "string",
            description: "Total amount of income transactions in the same month as the goal (only present for income goals)",
            example: "4500.50"
          },
          expenseTotal: {
            type: "string", 
            description: "Total amount of expense transactions in the same month as the goal (only present for expense goals)",
            example: "3200.75"
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
