import { z } from "zod";

class AuthSchema {
  static login = z.object({
    email: z.string().email("Email deve ter um formato válido"),
    password: z.string().min(1, "Senha é obrigatória"),
  });
  static logout = z.object({
    id: z
      .string({ required_error: "O campo 'id' é obrigatório." })
  });

  static refreshToken = z.object({
    refreshToken: z.string().min(1, "Refresh token é obrigatório"),
  });

  static revokeToken = z.object({
    userId: z.number().int().positive("ID do usuário deve ser um número positivo"),
  });

  static forgotPassword = z.object({
    email: z.string().email("Email deve ter um formato válido"),
  });

  static resetPassword = z.object({
    email: z.string().email("Email deve ter um formato válido"),
    code: z.string().length(6, "Código deve ter exatamente 6 dígitos"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  });

  static oauthLogin = z.object({
    email: z.string().email("Email deve ter um formato válido"),
    name: z.string().min(1, "Nome é obrigatório"),
    avatar: z.string().optional(),
  });
};

export default AuthSchema;
