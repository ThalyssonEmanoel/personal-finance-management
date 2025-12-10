export function requestBankTransferGet() {
  const parameters = [
    {
      "name": "id",
      "in": "query",
      "description": "Filter by bank transfer ID",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    },
    {
      "name": "userId",
      "in": "query",
      "description": "Filter by user ID",
      "required": true,
      "schema": { "type": "integer", "minimum": 1 }
    },
    {
      "name": "sourceAccountId",
      "in": "query",
      "description": "Filter by source account ID",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    },
    {
      "name": "destinationAccountId",
      "in": "query",
      "description": "Filter by destination account ID",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    },
    {
      "name": "amount",
      "in": "query",
      "description": "Filter by transfer amount",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "transfer_date",
      "in": "query",
      "description": "Filter by transfer date (YYYY-MM-DD format)",
      "required": false,
      "schema": {
        "type": "string",
        "format": "date"
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

const BankTransferRequest = {
  CreateBankTransferRequest: {
    title: "CreateBankTransferRequest",
    type: "object",
    required: ["amount", "transfer_date", "sourceAccountId", "destinationAccountId", "paymentMethodId"],
    properties: {
      amount: {
        type: "number",
        description: "Transfer amount",
        example: 500.00
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
        example: "Transfer to savings account"
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
        example: 1
      }
    },
    description: "Schema for creating a new bank transfer.",
    example: {
      amount: 500.00,
      transfer_date: "2024-01-15",
      description: "Transfer to savings account",
      sourceAccountId: 1,
      destinationAccountId: 2,
      paymentMethodId: 1
    }
  },
  UpdateBankTransferRequest: {
    title: "UpdateBankTransferRequest",
    type: "object",
    properties: {
      amount: {
        type: "number",
        description: "Transfer amount",
        example: 500.00
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
        example: "Transfer to savings account"
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
        example: 1
      }
    },
    description: "Schema for updating a bank transfer.",
    example: {
      amount: 750.00,
      transfer_date: "2024-01-15",
      description: "Updated transfer description",
      sourceAccountId: 1,
      destinationAccountId: 2,
      paymentMethodId: 1
    }
  },
};

export default BankTransferRequest;
