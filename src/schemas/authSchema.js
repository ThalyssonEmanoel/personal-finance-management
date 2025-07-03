import { z } from "zod";

const AuthSchema = {
  login: z.object({
    Email: z.string().email("Email deve ter um formato válido"),
    Senha: z.string().min(1, "Senha é obrigatória")
  })
};

export default AuthSchema;
