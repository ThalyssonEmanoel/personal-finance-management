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
  LogoutErrorResponse: {
    title: "LogoutErrorResponse",
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
    description: "Schema para resposta de erro de logout",
    examples: {
      userNotFound: {
        summary: "Usuário não encontrado",
        value: {
          error: {
            code: 404,
            message: "Usuário não encontrado."
          }
        }
      },
      noRefreshToken: {
        summary: "Usuário já sem refresh token",
        value: {
          error: {
            code: 401,
            message: "Usuário já está sem refresh token."
          }
        }
      },
      invalidId: {
        summary: "ID inválido",
        value: {
          error: {
            code: 400,
            message: "O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."
          }
        }
      }
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
  RefreshTokenErrorResponse: {
    title: "RefreshTokenErrorResponse",
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
    description: "Schema para resposta de erro de refresh token",
    examples: {
      invalidToken: {
        summary: "Token inválido ou expirado",
        value: {
          error: {
            code: 401,
            message: "Refresh token inválido ou expirado."
          }
        }
      },
      userNotFound: {
        summary: "Usuário não encontrado",
        value: {
          error: {
            code: 404,
            message: "Usuário não encontrado."
          }
        }
      },
      missingToken: {
        summary: "Token não fornecido",
        value: {
          error: {
            code: 400,
            message: "Refresh token é obrigatório."
          }
        }
      }
    }
  },
  RevokeTokenErrorResponse: {
    title: "RevokeTokenErrorResponse",
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
    description: "Schema para resposta de erro de revogação de token",
    examples: {
      userNotFound: {
        summary: "Usuário não encontrado",
        value: {
          error: {
            code: 404,
            message: "Usuário não encontrado."
          }
        }
      },
      missingUserId: {
        summary: "ID do usuário não fornecido",
        value: {
          error: {
            code: 400,
            message: "ID do usuário é obrigatório."
          }
        }
      }
    }
  }
};

export default AuthSchemas;