export function requestAccountGet() {
  const parameters = [
    {
      "name": "id",
      "in": "query",
      "description": "Filter by account ID",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    },
    {
      "name": "name",
      "in": "query",
      "description": "Filter by account name",
      "required": false,
      "schema": {
        "type": "string",
        "example": "Inter"
      }
    },
    {
      "name": "type",
      "in": "query",
      "description": "Filter by account type",
      "required": false,
      "schema": {
        "type": "string",
        "example": "Conta Salário"
      }
    },
    {
      "name": "balance",
      "in": "query",
      "description": "Filter by account balance",
      "required": false,
      "schema": {
        "type": "number",
        "format": "double",
        "example": 1000.00
      }
    },
    {
      "name": "userId",
      "in": "query",
      "description": "Filter by user ID",
      "required": true,
      "schema": {
        "type": "integer",
        "example": 1,
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
};

const AccountRequest = {
  CreateAccountFormRequest: {
    title: "CreateAccountFormRequest",
    type: "object",
    required: ["name", "type", "balance"],
    properties: {
      name: {
        type: "string",
        description: "Nome da conta",
        example: "Conta Corrente"
      },
      type: {
        type: "string",
        description: "Tipo da conta",
        example: "Corrente"
      },
      balance: {
        type: "number",
        description: "Saldo inicial da conta",
        example: 1000.00
      },
      icon: {
        type: "string",
        format: "binary",
        description: "Ícone da conta (opcional)",
        nullable: true
      },
      paymentMethodIds: {
        type: "string",
        description: "IDs dos métodos de pagamento separados por vírgula (opcional)",
        example: "1,2,3",
        nullable: true
      }
    },
    description: "Schema para criação de uma nova conta. Os paymentMethodIds devem ser uma string com IDs separados por vírgula (ex: '1,2,3' ou '1')."
  },
  UpdateAccountFormRequest: {
    title: "UpdateAccountFormRequest",
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Nome da conta (opcional)",
        example: "Conta Corrente"
      },
      type: {
        type: "string",
        description: "Tipo da conta (opcional)",
        example: "Corrente"
      },
      balance: {
        type: "number",
        description: "Saldo da conta (opcional)",
        example: 1200.00
      },
      icon: {
        type: "string",
        format: "binary",
        description: "Ícone da conta (opcional)",
        nullable: true
      },
      paymentMethodIds: {
        type: "string",
        description: "IDs dos métodos de pagamento separados por vírgula (opcional)",
        example: "1,2,3",
        nullable: true
      }
    },
    description: "Schema para atualização de conta. Os paymentMethodIds devem ser uma string com IDs separados por vírgula (ex: '1,2,3' ou '1'). Para remover todos os métodos, envie uma string vazia."
  },
};

export default AccountRequest;