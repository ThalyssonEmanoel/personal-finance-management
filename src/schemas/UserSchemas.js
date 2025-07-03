import { z } from "zod";

class UserSchemas {
  static listUser = z.object({
    Nome: z.string({ message: "O nome precisa ser definido como uma string/texto." })
      .refine((val) => !/^\d+$/.test(val), { message: "O nome precisa ser em palavras e não números." })
      .optional(),
    Email: z.string({ message: "O email precisa ser definido como uma string/texto." }).email({ message: "Email invalido" }).optional(),
    id: z.coerce.number({ message: "O campo 'id' deve ser um número inteiro." })
      .int({ message: "O campo 'id' deve ser um número inteiro." })
      .positive({ message: "O campo 'id' deve ser no mínimo 1." })
      .optional(),
    page: z.number({ message: "A page precisa ser um número inteiro positivo." })
      .int({ message: "A page precisa ser um número inteiro positivo." })
      .positive({ message: "A page precisa ser um número inteiro positivo." })
      .optional()
      .default(1),
    limit: z.number({ message: "A limit precisa ser um número inteiro positivo." })
      .int({ message: "O campo 'limit' deve ser um número inteiro." })
      .positive({ message: "O campo 'limit' deve ser no mínimo 1." })
      .default(10),
  });

  static createUser = z.object({
    Nome: z.string({ message: "O nome precisa ser definido como uma string/texto." })
      .refine((val) => !/^\d+$/.test(val), { message: "O nome precisa ser em palavras e não números." }),
    Email: z.string({ message: "O email precisa ser definido como uma string/texto." }).email({ message: "Email invalido" }),
    Senha: z.string({ message: "a senaha precisa ser definida como uma string/texto." })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/,
        { message: "A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial." }),
    Avatar: z.string({ message: "O avatar precisa ser definido como uma string/texto." }).optional().nullable(),
  });

  static updateUser = z.object({
    Nome: z.string({ message: "O nome precisa ser definido como uma string/texto." })
      .refine((val) => !/^\d+$/.test(val), { message: "O nome precisa ser em palavras e não números." })
      .optional(),
    Email: z.string({ message: "O email precisa ser definido como uma string/texto." }).email({ message: "Email invalido" }).optional(),
    Senha: z.string({ message: "a senha precisa ser definida como uma string/texto." })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/,
        { message: "A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial." })
      .optional(),
    Avatar: z.string({ message: "O avatar precisa ser definido como uma string/texto." }).optional().nullable(),
  });

  static userIdParam = z.object({
    id: z.coerce.number({ message: "O campo 'id' deve ser um número inteiro." })
      .int({ message: "O campo 'id' deve ser um número inteiro." })
      .positive({ message: "O campo 'id' deve ser no mínimo 1." })
  });
}

export default UserSchemas;