export function requestUserAdminGet() {
  const parameters = [
    {
      "name": "id",
      "in": "query",
      "description": "Filter by user ID",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    },
    {
      "name": "name",
      "in": "query",
      "description": "Filter by user name",
      "required": false,
      "schema": {
        "type": "string",
        "example": "random"
      }
    },
    {
      "name": "email",
      "in": "query",
      "description": "Filter by user email",
      "required": false,
      "schema": {
        "type": "string",
        "format": "email",
        "example": "random123@gmail.com"
      }
    },
    {
      "name": "isAdmin",
      "in": "query",
      "description": "Filter by administrative status",
      "required": false,
      "schema": {
        "type": "boolean"
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

const UserRequests = {
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
      }
    },
    description: "Schema para criação de um novo usuário com upload de arquivo"
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
};

export default UserRequests;