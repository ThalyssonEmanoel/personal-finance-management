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
};

export default AuthSchema;
