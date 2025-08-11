export function requestPaymentMethodsGet() {
  const parameters = [
    {
      "name": "id",
      "in": "query",
      "description": "Filter by payment method ID",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    },
    {
      "name": "name",
      "in": "query",
      "description": "Filter by payment method name",
      "required": false,
      "schema": {
        "type": "string"
      }
    },
    {
      "name": "limit",
      "in": "query",
      "description": "Delimit the number of results returned",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "default": 10
      }
    },
    {
      "name": "page",
      "in": "query",
      "description": "Number of the page to be returned",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "default": 1
      }
    },
  ];
  return {
    parameters,
  };
}

export function requestAccountPaymentMethodsGet() {
  const parameters = [
    {
      "name": "id",
      "in": "query",
      "description": "Filter by relationship ID",
      "required": false,
      "schema": { "type": "integer" }
    },
    {
      "name": "accountId",
      "in": "query",
      "description": "Filter by account ID",
      "required": false,
      "schema": { "type": "integer" }
    },
    {
      "name": "paymentMethodId",
      "in": "query",
      "description": "Filter by payment method ID",
      "required": false,
      "schema": { "type": "integer" }
    },
    {
      "name": "accountName",
      "in": "query",
      "description": "Filter by account name",
      "required": false,
      "schema": { "type": "string" }
    },
    {
      "name": "paymentMethodName",
      "in": "query",
      "description": "Filter by payment method name",
      "required": false,
      "schema": { "type": "string" }
    },
    {
      "name": "page",
      "in": "query",
      "description": "Page number",
      "required": false,
      "schema": { "type": "integer", "default": 1 }
    },
    {
      "name": "limit",
      "in": "query",
      "description": "Number of items per page",
      "required": false,
      "schema": { "type": "integer", "default": 10 }
    }
  ];
  return {
    parameters,
  };
}

const PaymentMethodsRequest = {
  CreatePaymentMethodRequest: {
    title: "CreatePaymentMethodRequest",
    type: "object",
    required: ["name"],
    properties: {
      name: {
        type: "string",
        description: "Payment method name",
        example: "PIX"
      }
    },
    description: "Schema for creating a new payment method.",
    example: {
      name: "PIX"
    }
  },
  UpdatePaymentMethodRequest: {
    title: "UpdatePaymentMethodRequest",
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Payment method name",
        example: "PIX"
      }
    },
    description: "Schema for updating a payment method.",
    example: {
      name: "PIX Updated"
    }
  },
};

export default PaymentMethodsRequest;
