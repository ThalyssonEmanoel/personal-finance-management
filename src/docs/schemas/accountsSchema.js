const AccountSchemas = {
  AccountResponse: {
    title: "AccountResponse",
    type: "object",
    properties: {
      account: {
        type: "object",
        description: "Dados da conta.",
        properties: {
          id: { type: "integer" },
          Nome: { type: "string" },
          Tipo: { type: "string" },
          Saldo: { type: "number" },
          Icon: { type: "string", nullable: true },
          userId: { type: "integer" }
        }
      }
    },
    description: "Schema para a resposta de get accounts.",
    example: {
      account: {
        id: 1,
        Nome: "Conta Corrente",
        Tipo: "Corrente",
        Saldo: 1000.00,
        Icon: null,
        userId: 1
      }
    }
  },
  CreateAccountFormRequest: {
    title: "CreateAccountFormRequest",
    type: "object",
    required: ["Nome", "Tipo", "Saldo", "userId"],
    properties: {
      Nome: {
        type: "string",
        description: "Nome da conta",
        example: "Conta Corrente"
      },
      Tipo: {
        type: "string",
        description: "Tipo da conta",
        example: "Corrente"
      },
      Saldo: {
        type: "number",
        description: "Saldo inicial da conta",
        example: 1000.00
      },
      Icon: {
        type: "string",
        format: "binary",
        description: "Ícone da conta (opcional)",
        nullable: true
      },
      userId: {
        type: "integer",
        description: "ID do usuário dono da conta",
        example: 1
      }
    },
    description: "Schema para criação de uma nova conta"
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
          Nome: { type: "string" },
          Tipo: { type: "string" },
          Saldo: { type: "number" },
          Icon: { type: "string", nullable: true },
          userId: { type: "integer" }
        }
      }
    },
    description: "Schema para a resposta de criação de conta.",
    example: {
      account: {
        id: 1,
        Nome: "Conta Corrente",
        Tipo: "Corrente",
        Saldo: 1000.00,
        Icon: null,
        userId: 1
      }
    }
  },
  UpdateAccountFormRequest: {
    title: "UpdateAccountFormRequest",
    type: "object",
    properties: {
      Nome: {
        type: "string",
        description: "Nome da conta (opcional)",
        example: "Conta Corrente"
      },
      Tipo: {
        type: "string",
        description: "Tipo da conta (opcional)",
        example: "Corrente"
      },
      Saldo: {
        type: "number",
        description: "Saldo da conta (opcional)",
        example: 1200.00
      },
      Icon: {
        type: "string",
        format: "binary",
        description: "Ícone da conta (opcional)",
        nullable: true
      },
      userId: {
        type: "integer",
        description: "ID do usuário dono da conta (opcional)",
        example: 1
      }
    },
    description: "Schema para atualização de conta"
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
          Nome: { type: "string" },
          Tipo: { type: "string" },
          Saldo: { type: "number" },
          Icon: { type: "string", nullable: true },
          userId: { type: "integer" }
        }
      }
    },
    description: "Schema para a resposta de atualização de conta.",
    example: {
      account: {
        id: 1,
        Nome: "Conta Corrente",
        Tipo: "Corrente",
        Saldo: 1200.00,
        Icon: null,
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
  AccountIdParameter: {
    name: "id",
    in: "path",
    required: true,
    schema: {
      type: "integer",
      minimum: 1
    },
    description: "ID único da conta",
    example: 1
  }
};

export default AccountSchemas;
