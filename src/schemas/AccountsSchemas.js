
import { z } from "zod";

class AccountSchemas {
  static listAccount = z.object({
    Nome: z.string({ message: "O nome da conta precisa ser definido como uma string/texto." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "O nome da conta precisa ser em palavras e não números." })
      .optional(),
    Tipo: z.string({ message: "O tipo precisa ser definido como uma string/texto." }).optional(),
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

  static createAccount = z.object({
    Nome: z.string({ message: "O nome da conta precisa ser definido como uma string/texto." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "O nome da conta precisa ser em palavras e não números." }),
    Tipo: z.string({ message: "O tipo precisa ser definido como uma string/texto." }),
    Saldo: z.coerce.number({ message: "O saldo precisa ser um número." }),
    Icon: z.string({ message: "O ícone precisa ser definido como uma string/texto." }).optional(),
    userId: z.coerce.number({ message: "O campo 'userId' deve ser um número inteiro." })
      .int({ message: "O campo 'userId' deve ser um número inteiro." })
      .positive({ message: "O campo 'userId' deve ser no mínimo 1." })
  });

  static updateAccount = z.object({
    Nome: z.string({ message: "O nome da conta precisa ser definido como uma string/texto." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "O nome da conta precisa ser em palavras e não números." })
      .optional(),
    Tipo: z.string({ message: "O tipo precisa ser definido como uma string/texto." }).optional(),
    Saldo: z.coerce.number({ message: "O saldo precisa ser um número." }).optional(),
    Icon: z.string({ message: "O ícone precisa ser definido como uma string/texto." }).optional(),
    userId: z.coerce.number({ message: "O campo 'userId' deve ser um número inteiro." })
      .int({ message: "O campo 'userId' deve ser um número inteiro." })
      .positive({ message: "O campo 'userId' deve ser no mínimo 1." })
      .optional(),
  });

  static accountIdParam = z.object({
    id: z.coerce.number({ message: "O campo 'id' deve ser um número inteiro." })
      .int({ message: "O campo 'id' deve ser um número inteiro." })
      .positive({ message: "O campo 'id' deve ser no mínimo 1." })
  });
}

export default AccountSchemas;
