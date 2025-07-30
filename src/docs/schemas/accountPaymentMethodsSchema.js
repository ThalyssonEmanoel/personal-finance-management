const AccountPaymentMethodsSchemas = {
  AccountPaymentMethodsResponse: {
    title: "AccountPaymentMethodsResponse",
    type: "object",
    properties: {
      accountPaymentMethods: {
        type: "array",
        description: "Lista de relacionamentos entre contas e métodos de pagamento.",
        items: {
          type: "object",
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
      }
    },
    description: "Schema para a resposta de relacionamentos entre contas e métodos de pagamento.",
    example: {
      accountPaymentMethods: [
        {
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
      ]
    }
  }
};

export default AccountPaymentMethodsSchemas;
