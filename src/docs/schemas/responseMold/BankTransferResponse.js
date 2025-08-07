const BankTransferResponse = {
  BankTransferResponseGet: {
    title: "BankTransferResponse",
    type: "object",
    properties: {
      bankTransfer: {
        type: "object",
        description: "Bank transfer data.",
        properties: {
          id: { type: "integer" },
          amount: { type: "number" },
          transfer_date: { type: "string", format: "date" },
          description: { type: "string", nullable: true },
          sourceAccountId: { type: "integer" },
          destinationAccountId: { type: "integer" },
          paymentMethodId: { type: "integer" },
          userId: { type: "integer" },
          sourceAccount: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              icon: { type: "string", nullable: true }
            }
          },
          destinationAccount: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              icon: { type: "string", nullable: true }
            }
          },
          paymentMethod: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" }
            }
          }
        }
      }
    },
    description: "Schema for bank transfer response.",
    example: {
      bankTransfer: {
        id: 1,
        amount: 500.00,
        transfer_date: "2024-01-15",
        description: "Transfer to savings account",
        sourceAccountId: 1,
        destinationAccountId: 2,
        paymentMethodId: 1,
        userId: 1,
        sourceAccount: {
          id: 1,
          name: "Conta Corrente",
          icon: null
        },
        destinationAccount: {
          id: 2,
          name: "Conta Poupança",
          icon: null
        },
        paymentMethod: {
          id: 1,
          name: "PIX"
        }
      }
    }
  },
  CreateBankTransferResponse: {
    title: "CreateBankTransferResponse",
    type: "object",
    properties: {
      bankTransfer: {
        type: "object",
        description: "Created bank transfer data.",
        properties: {
          id: { type: "integer" },
          amount: { type: "number" },
          transfer_date: { type: "string", format: "date" },
          description: { type: "string", nullable: true },
          sourceAccountId: { type: "integer" },
          destinationAccountId: { type: "integer" },
          paymentMethodId: { type: "integer" },
          userId: { type: "integer" }
        }
      }
    },
    description: "Schema for bank transfer creation response.",
    example: {
      bankTransfer: {
        id: 1,
        amount: 500.00,
        transfer_date: "2024-01-15",
        description: "Transfer to savings account",
        sourceAccountId: 1,
        destinationAccountId: 2,
        paymentMethodId: 1,
        userId: 1
      }
    }
  },
  UpdateBankTransferResponse: {
    title: "UpdateBankTransferResponse",
    type: "object",
    properties: {
      bankTransfer: {
        type: "object",
        description: "Updated bank transfer data.",
        properties: {
          id: { type: "integer" },
          amount: { type: "number" },
          transfer_date: { type: "string", format: "date" },
          description: { type: "string", nullable: true },
          sourceAccountId: { type: "integer" },
          destinationAccountId: { type: "integer" },
          paymentMethodId: { type: "integer" },
          userId: { type: "integer" }
        }
      }
    },
    description: "Schema for bank transfer update response.",
    example: {
      bankTransfer: {
        id: 1,
        amount: 750.00,
        transfer_date: "2024-01-15",
        description: "Updated transfer description",
        sourceAccountId: 1,
        destinationAccountId: 2,
        paymentMethodId: 1,
        userId: 1
      }
    }
  },
  DeleteBankTransferResponse: {
    title: "DeleteBankTransferResponse",
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Confirmation message for bank transfer deletion"
      }
    },
    description: "Schema for bank transfer deletion response.",
    example: {
      message: "Bank transfer deleted successfully"
    }
  },
  BankTransferListResponse: {
    title: "BankTransferListResponse",
    type: "object",
    properties: {
      bankTransfers: {
        type: "array",
        description: "List of bank transfers.",
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
            amount: { type: "number" },
            transfer_date: { type: "string", format: "date" },
            description: { type: "string", nullable: true },
            sourceAccountId: { type: "integer" },
            destinationAccountId: { type: "integer" },
            paymentMethodId: { type: "integer" },
            userId: { type: "integer" },
            sourceAccount: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
                icon: { type: "string", nullable: true }
              }
            },
            destinationAccount: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
                icon: { type: "string", nullable: true }
              }
            },
            paymentMethod: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" }
              }
            }
          }
        }
      },
      pagination: {
        type: "object",
        properties: {
          total: { type: "integer" },
          page: { type: "integer" },
          limit: { type: "integer" },
          totalPages: { type: "integer" }
        }
      }
    },
    description: "Schema for bank transfer list response.",
    example: {
      bankTransfers: [
        {
          id: 1,
          amount: 500.00,
          transfer_date: "2024-01-15",
          description: "Transfer to savings account",
          sourceAccountId: 1,
          destinationAccountId: 2,
          paymentMethodId: 1,
          userId: 1,
          sourceAccount: {
            id: 1,
            name: "Conta Corrente",
            icon: null
          },
          destinationAccount: {
            id: 2,
            name: "Conta Poupança",
            icon: null
          },
          paymentMethod: {
            id: 1,
            name: "PIX"
          }
        }
      ],
      pagination: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      }
    }
  }
};

export default BankTransferResponse;
