const AuthRequests = {
  LoginRequest: {
    title: "LoginRequest",
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "Email",
        description: "Email do usuário para autenticação",
        example: "thalysson140105@gmail.com"
      },
      password: {
        type: "string",
        minLength: 1,
        description: "Senha do usuário",
        example: "Senha@12345"
      }
    },
    description: "Schema para requisição de login",
    example: {
      email: "thalysson140105@gmail.com",
      password: "Senha@12345"
    }
  },
  LogoutRequest: {
    title: "LogoutRequest",
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
        pattern: "^[a-fA-F0-9]{24}$",
        description: "ID único do usuário (formato hexadecimal com 24 caracteres)",
        example: "507f1f77bcf86cd799439011"
      }
    },
    description: "Schema para requisição de logout",
    example: {
      id: "507f1f77bcf86cd799439011"
    }
  },
  RefreshTokenRequest: {
    title: "RefreshTokenRequest",
    type: "object",
    required: ["refreshToken"],
    properties: {
      refreshToken: {
        type: "string",
        description: "Token JWT de refresh válido",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTYxNjkyNDAwMH0..."
      }
    },
    description: "Schema para requisição de refresh token",
    example: {
      refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTYxNjkyNDAwMH0..."
    }
  },
  RevokeTokenRequest: {
    title: "RevokeTokenRequest",
    type: "object",
    required: ["userId"],
    properties: {
      userId: {
        type: "integer",
        description: "ID único do usuário cujos tokens serão revogados",
        example: 1
      }
    },
    description: "Schema para requisição de revogação de token",
    example: {
      userId: 1
    }
  },
  ForgotPasswordRequest: {
    title: "ForgotPasswordRequest",
    type: "object",
    required: ["email"],
    properties: {
      email: {
        type: "string",
        format: "Email",
        description: "Email do usuário para recuperação de senha",
        example: "thalysson140105@gmail.com"
      }
    },
    description: "Schema para requisição de recuperação de senha",
    example: {
      email: "thalysson140105@gmail.com"
    }
  },
  ResetPasswordRequest: {
    title: "ResetPasswordRequest",
    type: "object",
    required: ["email", "code", "password"],
    properties: {
      email: {
        type: "string",
        format: "Email",
        description: "Email do usuário para recuperação de senha",
        example: "thalysson140105@gmail.com"
      },
      code: {
        type: "string",
        minLength: 6,
        maxLength: 6,
        description: "Código de verificação enviado por email",
        example: "123456"
      },
      password: {
        type: "string",
        minLength: 6,
        description: "Nova senha do usuário",
        example: "NovaSenha@123"
      }
    },
    description: "Schema para requisição de redefinição de senha",
    example: {
      email: "thalysson140105@gmail.com",
      code: "123456",
      password: "NovaSenha@123"
    }
  }
};

export default AuthRequests;