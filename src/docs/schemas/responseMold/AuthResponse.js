const AuthResponse = {
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
          name: {
            type: "string",
            description: "Nome completo do usuário"
          },
          email: {
            type: "string",
            format: "Email",
            description: "Email do usuário"
          },
        }
      }
    },
    description: "Schema para resposta de login bem-sucedido",
    example: {
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE2MTY5MjQwMDB9...",
      refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTYxNjkyNDAwMH0...",
      usuario: {
        id: 1,
        name: "Thalysson Emanoel",
        email: "admin123@gmail.com",
        avatar: null
      }
    }
  },
  LogoutResponse: {
    title: "LogoutResponse",
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Mensagem de confirmação do logout",
        example: "Logout realizado com sucesso."
      }
    },
    description: "Schema para resposta de logout bem-sucedido",
    example: {
      message: "Logout realizado com sucesso."
    }
  },
  RefreshTokenResponse: {
    title: "RefreshTokenResponse",
    type: "object",
    properties: {
      accessToken: {
        type: "string",
        description: "Novo token JWT de acesso com validade curta",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      },
      refreshToken: {
        type: "string",
        description: "O mesmo token JWT de refresh enviado na requisição",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    },
    description: "Schema para resposta de refresh token bem-sucedido",
    example: {
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE2MTY5MjQwMDB9...",
      refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTYxNjkyNDAwMH0..."
    }
  },
  RevokeTokenResponse: {
    title: "RevokeTokenResponse",
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Mensagem de confirmação da revogação",
        example: "Token revogado com sucesso."
      }
    },
    description: "Schema para resposta de revogação de token bem-sucedida",
    example: {
      message: "Token revogado com sucesso."
    }
  },
  ForgotPasswordResponse: {
    title: "ForgotPasswordResponse",
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Mensagem de confirmação da solicitação de recuperação de senha",
        example: "Instruções para recuperação de senha enviadas para o email."
      }
    },
    description: "Schema para resposta de solicitação de recuperação de senha bem-sucedida",
    example: {
      message: "Instruções para recuperação de senha enviadas para o email."
    }
  },
  ResetPasswordResponse: {
    title: "ResetPasswordResponse",
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Mensagem de confirmação da redefinição de senha",
        example: "Senha redefinida com sucesso."
      }
    },
    description: "Schema para resposta de redefinição de senha bem-sucedida",
    example: {
      message: "Senha redefinida com sucesso."
    }
  }
};

export default AuthResponse;