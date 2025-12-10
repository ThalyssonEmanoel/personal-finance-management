const UserResponse = {
  UserResponse: {
    title: "UserResponse",
    type: "object",
    properties: {
      user: {
        type: "object",
        description: "Dados do usuário.",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          email: { type: "string", nullable: true },
          avatar: { type: "string", nullable: true },
        }
      }
    },
    description: "Schema para a resposta de get users.",
    example: {
      user: {
        id: 1,
        name: "Thalysson",
        email: "admin123@gmail.com",
        avatar: null,
      }
    }
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
          name: { type: "string" },
          email: { type: "string" },
          avatar: {
            type: "string",
            nullable: true,
            description: "Caminho do arquivo de avatar salvo no servidor"
          },
        }
      }
    },
    description: "Schema para a resposta de criação de usuário.",
    example: {
      user: {
        id: 1,
        name: "Thalysson Emanoel",
        email: "thalysson@example.com",
        avatar: "src/uploads/avatares/1699030930148-Avatar.jpg",
      }
    }
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
          name: { type: "string" },
          email: { type: "string", nullable: true },
          avatar: {
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
        name: "Thalysson Emanoel Atualizado",
        email: "thalysson.novo@example.com",
        avatar: "src/uploads/avatares/1699030930148-Avatar-updated.jpg",
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
      message: "Usuário e todos os dados relacionados foram deletados com sucesso"
    }
  },
    ChangePasswordResponse: {
    title: "ChangePasswordResponse",
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Mensagem de confirmação da alteração de senha"
      }
    },
    description: "Schema para a resposta de alteração de senha.",
    example: {
      message: "Senha alterada com sucesso."
    }
  }
};

export default UserResponse;