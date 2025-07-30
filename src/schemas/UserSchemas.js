import { z } from "zod";

class UserSchemas {
  static listUser = z.object({
    name: z.string({ message: "O nome precisa ser definido como uma string/texto." })
      .refine((val) => !/^\d+$/.test(val), { message: "O nome precisa ser em palavras e não números." })
      .optional(),
    email: z.string({ message: "O email precisa ser definido como uma string/texto." }).email({ message: "Email invalido" }).optional(),
    id: z.coerce.number({ message: "O campo 'id' deve ser um número inteiro." })
      .int({ message: "O campo 'id' deve ser um número inteiro." })
      .positive({ message: "O campo 'id' deve ser no mínimo 1." })
      .optional(),
    isAdmin: z.coerce.boolean({ message: "O campo 'isAdmin' deve ser um valor booleano." }).optional(),
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
    name: z.string({ message: "O nome precisa ser definido como uma string/texto." })
      .refine((val) => !/^\d+$/.test(val), { message: "O nome precisa ser em palavras e não números." }),
    email: z.string({ message: "O email precisa ser definido como uma string/texto." }).email({ message: "Email invalido" }),
    password: z.string({ message: "a senaha precisa ser definida como uma string/texto." })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/,
        { message: "A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial." }),
    avatar: z.string({ message: "O avatar precisa ser definido como uma string/texto." }).optional().nullable(),
  });

  static updateUser = z.object({
    name: z.string({ message: "O nome precisa ser definido como uma string/texto." })
      .refine((val) => !/^\d+$/.test(val), { message: "O nome precisa ser em palavras e não números." })
      .optional(),
    email: z.string({ message: "O email precisa ser definido como uma string/texto." })
      .email({ message: "Email invalido" })
      .optional()
      .or(z.literal(""))
      .or(z.null()),
    avatar: z.string({ message: "O avatar precisa ser definido como uma string/texto." }).optional().nullable(),
    isAdmin: z.coerce.boolean({ message: "O campo 'isAdmin' deve ser um valor booleano." }).optional(),
  });

  static userIdParam = z.object({
    id: z.coerce.number({ message: "O campo 'id' deve ser um número inteiro." })
      .int({ message: "O campo 'id' deve ser um número inteiro." })
      .positive({ message: "O campo 'id' deve ser no mínimo 1." })
  });

  static changePassword = z.object({
    currentPassword: z.string({ message: "A senha atual precisa ser definida como uma string/texto." })
      .min(1, { message: "A senha atual é obrigatória." }),
    newPassword: z.string({ message: "A nova senha precisa ser definida como uma string/texto." })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/,
        { message: "A nova senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial." }),
    confirmPassword: z.string({ message: "A confirmação de senha precisa ser definida como uma string/texto." })
      .min(1, { message: "A confirmação de senha é obrigatória." }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "A nova senha e a confirmação de senha devem ser iguais.",
    path: ["confirmPassword"],
  });
}

export default UserSchemas;