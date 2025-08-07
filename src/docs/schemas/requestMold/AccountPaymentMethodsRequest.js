export function requestAccountPaymentMethodsGet() {
  const parameters = [
    {
      "name": "id",
      "in": "query",
      "description": "Filter by relationship ID",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    },
    {
      "name": "accountId",
      "in": "query",
      "description": "Filter by account ID",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    },
    {
      "name": "paymentMethodId",
      "in": "query",
      "description": "Filter by payment method ID",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    },
    {
      "name": "accountName",
      "in": "query",
      "description": "Filter by account name",
      "required": false,
      "schema": {
        "type": "string"
      }
    },
    {
      "name": "paymentMethodName",
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

const AccountPaymentMethodsRequest = {
  CreateAccountPaymentMethodRequest: {
    title: "CreateAccountPaymentMethodRequest",
    type: "object",
    required: ["accountId", "paymentMethodId"],
    properties: {
      accountId: {
        type: "integer",
        description: "Account ID",
        example: 1
      },
      paymentMethodId: {
        type: "integer",
        description: "Payment method ID",
        example: 1
      }
    },
    description: "Schema for creating a new account payment method relationship.",
    example: {
      accountId: 1,
      paymentMethodId: 1
    }
  },
  UpdateAccountPaymentMethodRequest: {
    title: "UpdateAccountPaymentMethodRequest",
    type: "object",
    properties: {
      accountId: {
        type: "integer",
        description: "Account ID",
        example: 1
      },
      paymentMethodId: {
        type: "integer",
        description: "Payment method ID",
        example: 1
      }
    },
    description: "Schema for updating an account payment method relationship.",
    example: {
      paymentMethodId: 2
    }
  },
};

export default AccountPaymentMethodsRequest;
