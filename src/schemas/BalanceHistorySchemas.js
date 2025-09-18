import { z } from "zod";

class BalanceHistorySchemas {
  static listBalanceHistory = z.object({
    accountId: z.coerce.number({ message: "O ID da conta deve ser um número." })
      .int({ message: "O ID da conta deve ser um número inteiro." })
      .positive({ message: "O ID da conta deve ser maior que 0." }),
    startDate: z.string({ message: "A data inicial deve ser uma string." })
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "A data inicial deve estar no formato YYYY-MM-DD." })
      .optional(),
    endDate: z.string({ message: "A data final deve ser uma string." })
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "A data final deve estar no formato YYYY-MM-DD." })
      .optional(),
    page: z.coerce.number({ message: "A página deve ser um número inteiro positivo." })
      .int({ message: "A página deve ser um número inteiro positivo." })
      .positive({ message: "A página deve ser um número inteiro positivo." })
      .optional()
      .default(1),
    limit: z.coerce.number({ message: "O limite deve ser um número inteiro positivo." })
      .int({ message: "O limite deve ser um número inteiro." })
      .positive({ message: "O limite deve ser pelo menos 1." })
      .optional(),
  }).refine((data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  }, {
    message: "A data inicial deve ser menor ou igual à data final.",
    path: ["startDate"]
  });

  static listBalanceHistoryQuery = z.object({
    accountId: z.coerce.number({ message: "O ID da conta deve ser um número." })
      .int({ message: "O ID da conta deve ser um número inteiro." })
      .positive({ message: "O ID da conta deve ser maior que 0." }),
    userId: z.coerce.number({ message: "O ID do usuário deve ser um número." })
      .int({ message: "O ID do usuário deve ser um número inteiro." })
      .positive({ message: "O ID do usuário deve ser maior que 0." }),
    startDate: z.string({ message: "A data inicial deve ser uma string." })
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "A data inicial deve estar no formato YYYY-MM-DD." })
      .optional(),
    endDate: z.string({ message: "A data final deve ser uma string." })
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "A data final deve estar no formato YYYY-MM-DD." })
      .optional(),
    page: z.coerce.number({ message: "A página deve ser um número inteiro positivo." })
      .int({ message: "A página deve ser um número inteiro positivo." })
      .positive({ message: "A página deve ser um número inteiro positivo." })
      .optional()
      .default(1),
    limit: z.coerce.number({ message: "O limite deve ser um número inteiro positivo." })
      .int({ message: "O limite deve ser um número inteiro." })
      .positive({ message: "O limite deve ser pelo menos 1." })
      .optional(),
  });

  static createBalanceRecord = z.object({
    accountId: z.coerce.number({ message: "O ID da conta deve ser um número." })
      .int({ message: "O ID da conta deve ser um número inteiro." })
      .positive({ message: "O ID da conta deve ser maior que 0." }),
    date: z.union([
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "A data deve estar no formato YYYY-MM-DD." }),
      z.date()
    ], { message: "A data deve ser uma string no formato YYYY-MM-DD ou um objeto Date." })
      .transform((val) => {
        if (typeof val === 'string') {
          return new Date(val);
        }
        return val;
      }),
    balance: z.coerce.number({ message: "O saldo deve ser um número." })
      .finite({ message: "O saldo deve ser um número válido." })
  });

  static recalculateBalance = z.object({
    accountId: z.coerce.number({ message: "O ID da conta deve ser um número." })
      .int({ message: "O ID da conta deve ser um número inteiro." })
      .positive({ message: "O ID da conta deve ser maior que 0." })
      .optional(),
    startDate: z.string({ message: "A data inicial deve ser uma string." })
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "A data inicial deve estar no formato YYYY-MM-DD." }),
    endDate: z.string({ message: "A data final deve ser uma string." })
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "A data final deve estar no formato YYYY-MM-DD." }),
    userId: z.coerce.number({ message: "O ID do usuário deve ser um número." })
      .int({ message: "O ID do usuário deve ser um número inteiro." })
      .positive({ message: "O ID do usuário deve ser maior que 0." })
      .optional()
  }).refine((data) => {
    return new Date(data.startDate) <= new Date(data.endDate);
  }, {
    message: "A data inicial deve ser menor ou igual à data final.",
    path: ["startDate"]
  });

  static accountIdParam = z.object({
    accountId: z.coerce.number({ message: "O ID da conta deve ser um número." })
      .int({ message: "O ID da conta deve ser um número inteiro." })
      .positive({ message: "O ID da conta deve ser maior que 0." })
  });

  static userIdParam = z.object({
    userId: z.coerce.number({ message: "O ID do usuário deve ser um número." })
      .int({ message: "O ID do usuário deve ser um número inteiro." })
      .positive({ message: "O ID do usuário deve ser maior que 0." })
  });
}

export default BalanceHistorySchemas;
