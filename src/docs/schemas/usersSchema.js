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
          name: { type: "string" },
          email: { type: "string", nullable: true },
          avatar: { type: "string", nullable: true },// Pode ser nulo se o usuário não tiver um avatar
        }
      }
    },
    description: "Schema para a resposta de get users.",
    example: {
      user: {
        id: 1,
        name: "Thalysson",
        email: "admin123@gmail.com",
        avatar: null, // ou uma URL de imagem se o usuário tiver um avatar
      }
    }
  },
  CreateUserFormRequestAdmin: {
    title: "CreateUserFormRequest",
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: {
        type: "string",
        description: "Nome completo do usuário",
        example: "Thalysson Emanoel"
      },
      email: {
        type: "string",
        format: "email",
        description: "Email único do usuário",
        example: "thalysson@example.com"
      },
      password: {
        type: "string",
        minLength: 8,
        description: "Senha do usuário (mínimo 8 caracteres com maiúscula, minúscula, número e caractere especial)",
        example: "MinhaSenh@123"
      },
      avatar: {
        type: "string",
        format: "binary",
        description: "Arquivo de imagem para o avatar do usuário (opcional, máximo 2MB)",
        nullable: true
      },
      isAdmin: {
        type: "boolean",
        description: "Define se o usuário é administrador (opcional, apenas administradores podem alterar este campo)",
        example: false
      }
    },
    description: "Schema para criação de um novo usuário com upload de arquivo"
  },
  CreateUserFormRequest: {
    title: "CreateUserFormRequest",
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: {
        type: "string",
        description: "Nome completo do usuário",
        example: "Thalysson Emanoel"
      },
      email: {
        type: "string",
        format: "email",
        description: "Email único do usuário",
        example: "thalysson@example.com"
      },
      password: {
        type: "string",
        minLength: 8,
        description: "Senha do usuário (mínimo 8 caracteres com maiúscula, minúscula, número e caractere especial)",
        example: "MinhaSenh@123"
      },
      avatar: {
        type: "string",
        format: "binary",
        description: "Arquivo de imagem para o avatar do usuário (opcional, máximo 2MB)",
        nullable: true
      },
    },
    description: "Schema para criação de um novo usuário com upload de arquivo"
  },
  CreateUserResponseAdmin: {
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
          isAdmin: {
            type: "boolean",
            description: "Indica se o usuário é administrador (sempre false na criação)"
          }
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
        isAdmin: false
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
        isAdmin: false
      }
    }
  },
  UpdateUserFormRequestAdmin: {
    title: "UpdateUserFormRequest",
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Nome completo do usuário (opcional)",
        example: "Thalysson Emanoel Atualizado"
      },
      email: {
        type: "string",
        format: "email",
        description: "Email único do usuário (opcional)",
        nullable: true,
        example: "thalysson.novo@example.com"
      },
      avatar: {
        type: "string",
        format: "binary",
        description: "Novo arquivo de imagem para o avatar do usuário (opcional, máximo 2MB)",
        nullable: true
      },
      isAdmin: {
        type: "boolean",
        description: "Define se o usuário é administrador (opcional, apenas administradores podem alterar este campo)",
        example: true
      }
    },
    description: "Schema para atualização de usuário com upload de arquivo"
  },
  UpdateUserFormRequest: {
    title: "UpdateUserFormRequest",
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Nome completo do usuário (opcional)",
        example: "Thalysson Emanoel Atualizado"
      },
      email: {
        type: "string",
        format: "email",
        description: "Email único do usuário (opcional)",
        nullable: true,
        example: "thalysson.novo@example.com"
      },
      avatar: {
        type: "string",
        format: "binary",
        description: "Novo arquivo de imagem para o avatar do usuário (opcional, máximo 2MB)",
        nullable: true
      },
    },
    description: "Schema para atualização de usuário com upload de arquivo"
  },
  UpdateUserResponseAdmin: {
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
          },
          isAdmin: {
            type: "boolean",
            description: "Indica se o usuário é administrador"
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
        isAdmin: true
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
        isAdmin: true
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
  },
  ChangePasswordRequest: {
    title: "ChangePasswordRequest",
    type: "object",
    required: ["currentPassword", "newPassword", "confirmPassword"],
    properties: {
      currentPassword: {
        type: "string",
        description: "Senha atual do usuário",
        example: "MinhaSenh@123"
      },
      newPassword: {
        type: "string",
        minLength: 8,
        description: "Nova senha do usuário (mínimo 8 caracteres com maiúscula, minúscula, número e caractere especial)",
        example: "NovaSenh@456"
      },
      confirmPassword: {
        type: "string",
        description: "Confirmação da nova senha (deve ser igual à nova senha)",
        example: "NovaSenh@456"
      }
    },
    description: "Schema para alteração de senha do usuário"
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

export default UserSchemas;