const AuthSchemas = {
  LoginRequest: {
    title: "LoginRequest",
    type: "object",
    required: ["Email", "Senha"],
    properties: {
      Email: {
        type: "string",
        format: "Email",
        description: "Email do usuário para autenticação",
        example: "thalysson140105@gmail.com"
      },
      Senha: {
        type: "string",
        minLength: 1,
        description: "Senha do usuário",
        example: "Senha@12345"
      }
    },
    description: "Schema para requisição de login",
    example: {
      Email: "thalysson140105@gmail.com",
      Senha: "Senha@12345"
    }
  },
  LoginResponse: {
    title: "LoginResponse",
    type: "object",
    properties: {
      accessToken: {
        type: "string",
        description: "Token JWT de acesso com validade curta",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      },
      refreshToken: {
        type: "string",
        description: "Token JWT de refresh com validade longa",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      },
      usuario: {
        type: "object",
        description: "Dados do usuário autenticado",
        properties: {
          id: { 
            type: "integer",
            description: "ID único do usuário"
          },
          Nome: { 
            type: "string",
            description: "Nome completo do usuário"
          },
          Email: { 
            type: "string",
            format: "Email",
            description: "Email do usuário"
          },
          Avatar: { 
            type: "string",
            nullable: true,
            description: "Caminho do avatar do usuário"
          }
        }
      }
    },
    description: "Schema para resposta de login bem-sucedido",
    example: {
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE2MTY5MjQwMDB9...",
      refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTYxNjkyNDAwMH0...",
      usuario: {
        id: 1,
        Nome: "Thalysson Emanoel",
        Email: "admin123@gmail.com",
        Avatar: null
      }
    }
  },
  LoginErrorResponse: {
    title: "LoginErrorResponse",
    type: "object",
    properties: {
      error: {
        type: "object",
        properties: {
          code: {
            type: "integer",
            description: "Código do erro"
          },
          message: {
            type: "string",
            description: "Mensagem de erro"
          }
        }
      }
    },
    description: "Schema para resposta de erro de login",
    example: {
      error: {
        code: 401,
        message: "Email ou Senha inválidos"
      }
    }
  }
};

export default AuthSchemas;