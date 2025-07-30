const PaymentMethodsSchemas = {
  PaymentMethodsResponse: {
    title: "PaymentMethodsResponse",
    type: "object",
    properties: {
      paymentMethods: {
        type: "array",
        description: "Lista de métodos de pagamento.",
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            _count: {
              type: "object",
              properties: {
                accountPaymentMethods: { type: "integer" },
                transactions: { type: "integer" }
              }
            }
          }
        }
      }
    },
    description: "Schema para a resposta de listagem de métodos de pagamento.",
    example: {
      paymentMethods: [
        {
          id: 1,
          name: "PIX",
          _count: {
            accountPaymentMethods: 5,
            transactions: 12
          }
        },
        {
          id: 2,
          name: "Dinheiro",
          _count: {
            accountPaymentMethods: 3,
            transactions: 8
          }
        }
      ]
    }
  }
};

export default PaymentMethodsSchemas;
