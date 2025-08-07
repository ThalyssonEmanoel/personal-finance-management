const BankTransferSchemas = {
  BankTransferResponse: {
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
          },
          user: {
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
        description: "Transferência para conta poupança",
        sourceAccountId: 1,
        destinationAccountId: 2,
        paymentMethodId: 4,
        userId: 1,
        sourceAccount: {
          id: 1,
          name: "Conta Corrente",
          icon: "💳"
        },
        destinationAccount: {
          id: 2,
          name: "Conta Poupança",
          icon: "🏦"
        },
        paymentMethod: {
          id: 4,
          name: "PIX"
        },
        user: {
          id: 1,
          name: "João Silva"
        }
      }
    }
  },
  
  CreateBankTransferRequest: {
    title: "CreateBankTransferRequest",
    type: "object",
    required: ["amount", "transfer_date", "sourceAccountId", "destinationAccountId", "paymentMethodId"],
    properties: {
      amount: {
        type: "number",
        description: "Transfer amount",
        example: 500.00,
        minimum: 0.01
      },
      transfer_date: {
        type: "string",
        format: "date",
        description: "Transfer date",
        example: "2024-01-15"
      },
      description: {
        type: "string",
        nullable: true,
        description: "Transfer description",
        example: "Transferência para conta poupança"
      },
      sourceAccountId: {
        type: "integer",
        description: "Source account ID (where money comes from)",
        example: 1
      },
      destinationAccountId: {
        type: "integer",
        description: "Destination account ID (where money goes to)",
        example: 2
      },
      paymentMethodId: {
        type: "integer",
        description: "Payment method ID (must be compatible with source account)",
        example: 4
      }
    },
    description: "Schema for creating a new bank transfer. Both accounts must belong to the authenticated user and source account must have sufficient balance.",
    example: {
      amount: 500.00,
      transfer_date: "2024-01-15",
      description: "Transferência para conta poupança",
      sourceAccountId: 1,
      destinationAccountId: 2,
      paymentMethodId: 4
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
          },
          user: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" }
            }
          }
        }
      }
    },
    description: "Schema for created bank transfer response. The transfer automatically updates both account balances.",
    example: {
      bankTransfer: {
        id: 1,
        amount: 500.00,
        transfer_date: "2024-01-15",
        description: "Transferência para conta poupança",
        sourceAccountId: 1,
        destinationAccountId: 2,
        paymentMethodId: 4,
        userId: 1,
        sourceAccount: {
          id: 1,
          name: "Conta Corrente",
          icon: "💳"
        },
        destinationAccount: {
          id: 2,
          name: "Conta Poupança",
          icon: "🏦"
        },
        paymentMethod: {
          id: 4,
          name: "PIX"
        },
        user: {
          id: 1,
          name: "João Silva"
        }
      }
    }
  },

  UpdateBankTransferRequest: {
    title: "UpdateBankTransferRequest",
    type: "object",
    properties: {
      amount: {
        type: "number",
        description: "Transfer amount",
        example: 750.00,
        minimum: 0.01
      },
      transfer_date: {
        type: "string",
        format: "date",
        description: "Transfer date",
        example: "2024-01-16"
      },
      description: {
        type: "string",
        nullable: true,
        description: "Transfer description",
        example: "Transferência atualizada"
      },
      sourceAccountId: {
        type: "integer",
        description: "Source account ID",
        example: 1
      },
      destinationAccountId: {
        type: "integer",
        description: "Destination account ID",
        example: 2
      },
      paymentMethodId: {
        type: "integer",
        description: "Payment method ID",
        example: 4
      }
    },
    description: "Schema for updating a bank transfer. Note: Updating transfer amount will not automatically adjust account balances.",
    example: {
      amount: 750.00,
      description: "Transferência atualizada"
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
    description: "Schema for updated bank transfer response.",
    example: {
      bankTransfer: {
        id: 1,
        amount: 750.00,
        transfer_date: "2024-01-16",
        description: "Transferência atualizada",
        sourceAccountId: 1,
        destinationAccountId: 2,
        paymentMethodId: 4,
        userId: 1,
        sourceAccount: {
          id: 1,
          name: "Conta Corrente",
          icon: "💳"
        },
        destinationAccount: {
          id: 2,
          name: "Conta Poupança",
          icon: "🏦"
        },
        paymentMethod: {
          id: 4,
          name: "PIX"
        }
      }
    }
  },

  DeleteBankTransferResponse: {
    title: "DeleteBankTransferResponse",
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Success message"
      }
    },
    description: "Schema for bank transfer deletion response.",
    example: {
      message: "Transferência bancária deletada com sucesso"
    }
  },

  BankTransferListResponse: {
    title: "BankTransferListResponse",
    type: "object",
    properties: {
      bankTransfers: {
        type: "array",
        description: "List of bank transfers",
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
            amount: { type: "number" },
            transfer_date: { type: "string", format: "date" },
            description: { type: "string", nullable: true },
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
          total: { type: "integer", description: "Total number of records" },
          page: { type: "integer", description: "Current page" },
          take: { type: "integer", description: "Records per page" }
        }
      }
    },
    description: "Schema for bank transfer list response with pagination.",
    example: {
      bankTransfers: [
        {
          id: 1,
          amount: 500.00,
          transfer_date: "2024-01-15",
          description: "Transferência para poupança",
          sourceAccount: {
            id: 1,
            name: "Conta Corrente",
            icon: "💳"
          },
          destinationAccount: {
            id: 2,
            name: "Conta Poupança",
            icon: "🏦"
          },
          paymentMethod: {
            id: 4,
            name: "PIX"
          }
        }
      ],
      pagination: {
        total: 1,
        page: 1,
        take: 10
      }
    }
  },
};

export default BankTransferSchemas;
