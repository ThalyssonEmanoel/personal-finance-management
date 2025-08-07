const AccountPaymentMethodsResponse = {
  AccountPaymentMethodResponseGet: {
    title: "AccountPaymentMethodResponse",
    type: "object",
    properties: {
      accountPaymentMethod: {
        type: "object",
        description: "Account payment method relationship data.",
        properties: {
          id: { type: "integer" },
          accountId: { type: "integer" },
          paymentMethodId: { type: "integer" },
          account: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              type: { type: "string" },
              userId: { type: "integer" },
              user: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" }
                }
              }
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
    description: "Schema for account payment method relationship response.",
    example: {
      accountPaymentMethod: {
        id: 1,
        accountId: 1,
        paymentMethodId: 1,
        account: {
          id: 1,
          name: "Conta Corrente",
          type: "corrente",
          userId: 1,
          user: {
            id: 1,
            name: "João Silva"
          }
        },
        paymentMethod: {
          id: 1,
          name: "PIX"
        }
      }
    }
  },
  CreateAccountPaymentMethodResponse: {
    title: "CreateAccountPaymentMethodResponse",
    type: "object",
    properties: {
      accountPaymentMethod: {
        type: "object",
        description: "Created account payment method relationship data.",
        properties: {
          id: { type: "integer" },
          accountId: { type: "integer" },
          paymentMethodId: { type: "integer" }
        }
      }
    },
    description: "Schema for account payment method relationship creation response.",
    example: {
      accountPaymentMethod: {
        id: 1,
        accountId: 1,
        paymentMethodId: 1
      }
    }
  },
  UpdateAccountPaymentMethodResponse: {
    title: "UpdateAccountPaymentMethodResponse",
    type: "object",
    properties: {
      accountPaymentMethod: {
        type: "object",
        description: "Updated account payment method relationship data.",
        properties: {
          id: { type: "integer" },
          accountId: { type: "integer" },
          paymentMethodId: { type: "integer" }
        }
      }
    },
    description: "Schema for account payment method relationship update response.",
    example: {
      accountPaymentMethod: {
        id: 1,
        accountId: 1,
        paymentMethodId: 2
      }
    }
  },
  DeleteAccountPaymentMethodResponse: {
    title: "DeleteAccountPaymentMethodResponse",
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Confirmation message for account payment method relationship deletion"
      }
    },
    description: "Schema for account payment method relationship deletion response.",
    example: {
      message: "Account payment method relationship deleted successfully"
    }
  }
};

export default AccountPaymentMethodsResponse;
