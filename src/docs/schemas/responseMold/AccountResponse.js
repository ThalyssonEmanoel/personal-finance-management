

const AccountResponse = {
  AccountResponseGet: {
    title: "AccountResponse",
    type: "object",
    properties: {
      account: {
        type: "object",
        description: "Dados da conta.",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          type: { type: "string" },
          balance: { type: "number" },
          icon: { type: "string", nullable: true },
          userId: { type: "integer" }
        }
      }
    },
    description: "Schema para a resposta de get accounts.",
    example: {
      account: {
        id: 1,
        name: "Conta Corrente",
        type: "Corrente",
        balance: 1000.00,
        icon: null,
        userId: 1
      }
    }
  },
  CreateAccountResponse: {
    title: "CreateAccountResponse",
    type: "object",
    properties: {
      account: {
        type: "object",
        description: "Dados da conta criada.",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          type: { type: "string" },
          balance: { type: "number" },
          icon: { type: "string", nullable: true },
          userId: { type: "integer" }
        }
      }
    },
    description: "Schema para a resposta de criação de conta.",
    example: {
      account: {
        id: 1,
        name: "Conta Corrente",
        type: "Corrente",
        balance: 1000.00,
        icon: null,
        userId: 1
      }
    }
  },
  UpdateAccountResponse: {
    title: "UpdateAccountResponse",
    type: "object",
    properties: {
      account: {
        type: "object",
        description: "Dados da conta atualizada.",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          type: { type: "string" },
          balance: { type: "number" },
          icon: { type: "string", nullable: true }
        }
      }
    },
    description: "Schema para a resposta de atualização de conta.",
    example: {
      account: {
        id: 1,
        name: "Conta Corrente",
        type: "Corrente",
        balance: 1200.00,
        icon: null,
        userId: 1
      }
    }
  },
  DeleteAccountResponse: {
    title: "DeleteAccountResponse",
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Mensagem de confirmação da exclusão"
      }
    },
    description: "Schema para a resposta de exclusão de conta.",
    example: {
      message: "Conta deletada com sucesso"
    }
  },
};

export default AccountResponse;