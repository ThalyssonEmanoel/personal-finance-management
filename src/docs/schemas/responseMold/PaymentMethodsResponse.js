const PaymentMethodsResponse = {
  PaymentMethodResponseGet: {
    title: "PaymentMethodResponse",
    type: "object",
    properties: {
      paymentMethod: {
        type: "object",
        description: "Payment method data.",
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
    },
    description: "Schema for payment method response.",
    example: {
      paymentMethod: {
        id: 1,
        name: "PIX",
        _count: {
          accountPaymentMethods: 5,
          transactions: 12
        }
      }
    }
  },
  CreatePaymentMethodResponse: {
    title: "CreatePaymentMethodResponse",
    type: "object",
    properties: {
      paymentMethod: {
        type: "object",
        description: "Created payment method data.",
        properties: {
          id: { type: "integer" },
          name: { type: "string" }
        }
      }
    },
    description: "Schema for payment method creation response.",
    example: {
      paymentMethod: {
        id: 1,
        name: "PIX"
      }
    }
  },
  UpdatePaymentMethodResponse: {
    title: "UpdatePaymentMethodResponse",
    type: "object",
    properties: {
      paymentMethod: {
        type: "object",
        description: "Updated payment method data.",
        properties: {
          id: { type: "integer" },
          name: { type: "string" }
        }
      }
    },
    description: "Schema for payment method update response.",
    example: {
      paymentMethod: {
        id: 1,
        name: "PIX Updated"
      }
    }
  },
  DeletePaymentMethodResponse: {
    title: "DeletePaymentMethodResponse",
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Confirmation message for payment method deletion"
      }
    },
    description: "Schema for payment method deletion response.",
    example: {
      message: "Payment method deleted successfully"
    }
  }
};

export default PaymentMethodsResponse;
