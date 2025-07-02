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
  CreateUserRequest: {
    title: "CreateUserRequest",
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
        example: "123456"
      },
      Avatar: {
        type: "string",
        nullable: true,
        description: "URL do avatar do usuário (opcional)",
        example: "https://example.com/avatar.jpg"
      }
    },
    description: "Schema para criação de um novo usuário"
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
          Avatar: { type: "string", nullable: true }
        }
      }
    },
    description: "Schema para a resposta de criação de usuário.",
    example: {
      user: {
        id: 1,
        Nome: "Thalysson Emanoel",
        Email: "thalysson@example.com",
        Avatar: null
      }
    }
  }
};

export default UserSchemas;
