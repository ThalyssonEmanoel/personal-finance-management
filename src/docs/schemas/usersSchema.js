const UserSchemas = {
  UserResponse: {
    title: "UserResponse",
    type: "object",
    properties: {//Esse properties é o que vai ser retornado no get
      user: {
        type: "object",
        description: "Dados do usuário.",
        properties: {
          id: { type: "integer" },
          Nome: { type: "string" },
          Email: { type: "string" },
          Avatar: { type: "string", nullable: true },// Pode ser nulo se o usuário não tiver um avatar
        }
      }
    },
    description: "Schema para a resposta de get users.",
    example: {
      user: {
        id: 1,
        Nome: "Thalysson",
        Email: "admin123@gmail.com",
        Avatar: null // ou uma URL de imagem se o usuário tiver um avatar
      }
    }
  },
  CreateUserFormRequest: {
    title: "CreateUserFormRequest",
    type: "object",
    required: ["Nome", "Email", "Senha"],
    properties: {
      Nome: {
        type: "string",
        description: "Nome completo do usuário",
        example: "Thalysson Emanoel"
      },
      Email: {
        type: "string",
        format: "email",
        description: "Email único do usuário",
        example: "thalysson@example.com"
      },
      Senha: {
        type: "string",
        minLength: 6,
        description: "Senha do usuário (mínimo 6 caracteres)",
        example: "123ABC@abc"
      },
      Avatar: {
        type: "string",
        format: "binary",
        description: "Arquivo de imagem para o avatar do usuário (opcional, máximo 2MB)",
        nullable: true
      }
    },
    description: "Schema para criação de um novo usuário com upload de arquivo"
  },
  CreateUserResponse: {
    title: "CreateUserResponse",
    type: "object",
    properties: {
      user: {
        type: "object",
        description: "Dados do usuário criado.",
        properties: {
          id: { type: "integer" },
          Nome: { type: "string" },
          Email: { type: "string" },
          Avatar: {
            type: "string",
            nullable: true,
            description: "Caminho do arquivo de avatar salvo no servidor"
          }
        }
      }
    },
    description: "Schema para a resposta de criação de usuário.",
    example: {
      user: {
        id: 1,
        Nome: "Thalysson Emanoel",
        Email: "thalysson@example.com",
        Avatar: "src/uploads/avatares/1699030930148-Avatar.jpg"
      }
    }
  },
  UpdateUserFormRequest: {
    title: "UpdateUserFormRequest",
    type: "object",
    properties: {
      Nome: {
        type: "string",
        description: "Nome completo do usuário (opcional)",
        example: "Thalysson Emanoel "
      },
      Email: {
        type: "string",
        format: "email",
        description: "Email único do usuário (opcional)",
        example: "thalysson.novo@example.com"
      },
      Senha: {
        type: "string",
        minLength: 8,
        description: "Nova senha do usuário (opcional, mínimo 8 caracteres com maiúscula, minúscula, número e caractere especial)",
        example: "NovaSenh@123"
      },
      Avatar: {
        type: "string",
        format: "binary",
        description: "Novo arquivo de imagem para o avatar do usuário (opcional, máximo 2MB)",
        nullable: true
      }
    },
    description: "Schema para atualização de usuário com upload de arquivo"
  },
  UpdateUserResponse: {
    title: "UpdateUserResponse",
    type: "object",
    properties: {
      user: {
        type: "object",
        description: "Dados do usuário atualizado.",
        properties: {
          id: { type: "integer" },
          Nome: { type: "string" },
          Email: { type: "string" },
          Avatar: {
            type: "string",
            nullable: true,
            description: "Caminho do arquivo de avatar atualizado no servidor"
          }
        }
      }
    },
    description: "Schema para a resposta de atualização de usuário.",
    example: {
      user: {
        id: 1,
        Nome: "Thalysson Emanoel ",
        Email: "thalysson.novo@example.com",
        Avatar: "src/uploads/avatares/1699030930148-Avatar-updated.jpg"
      }
    }
  },
  DeleteUserResponse: {
    title: "DeleteUserResponse",
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Mensagem de confirmação da exclusão"
      }
    },
    description: "Schema para a resposta de exclusão de usuário.",
    example: {
      message: "Usuário deletado com sucesso"
    }
  },
  UserIdParameter: {
    name: "id",
    in: "path",
    required: true,
    schema: {
      type: "integer",
      minimum: 1
    },
    description: "ID único do usuário",
    example: 1
  }
};

export default UserSchemas;