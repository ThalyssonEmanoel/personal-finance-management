import { z } from "zod";
import { id } from "zod/v4/locales";

class GoalSchemas {
  static createGoal = z.object({
    name: z.string({ message: "O nome é obrigatório e deve ser um texto." })
      .min(1, { message: "O nome não pode estar vazio." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "O nome deve conter palavras, não apenas números." }),
    date: z.string({ message: "A data é obrigatória." })
      .refine((val) => !isNaN(Date.parse(val)), { message: "A data deve estar em um formato válido." }),
    transaction_type: z.enum(["expense", "income"], { 
      message: "O tipo de transação deve ser 'expense' (despesa) ou 'income' (receita)." 
    }),
    value: z.coerce.number({ message: "O valor é obrigatório e deve ser um número." })
      .positive({ message: "O valor deve ser maior que 0." })
  });

  static createGoalQuery = z.object({
    userId: z.coerce.number({ message: "O ID do usuário é obrigatório e deve ser um número inteiro." })
      .int({ message: "O ID do usuário deve ser um número inteiro." })
      .positive({ message: "O ID do usuário deve ser maior que 0." })
  });

  static listGoals = z.object({
    id: z.coerce.number({ message: "O ID deve ser um número inteiro." })
      .int({ message: "O ID deve ser um número inteiro." })
      .positive({ message: "O ID deve ser pelo menos 1." }).optional(),
    name: z.string({ message: "O nome deve ser um texto." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "O nome deve conter palavras, não apenas números." })
      .optional(),
    transaction_type: z.enum(["expense", "income"], { 
      message: "O tipo de transação deve ser 'expense' ou 'income'." 
    }).optional(),
    date: z.string({ message: "A data deve ser uma string de data válida." })
      .refine((val) => !isNaN(Date.parse(val)), { message: "A data deve estar em um formato válido." })
      .optional(),
    userId: z.coerce.number({ message: "O ID do usuário deve ser um número inteiro." })
      .int({ message: "O ID do usuário deve ser um número inteiro." })
      .positive({ message: "O ID do usuário deve ser maior que 0." })
      .optional(),
    page: z.coerce.number({ message: "A página deve ser um número inteiro positivo." })
      .int({ message: "A página deve ser um número inteiro positivo." })
      .positive({ message: "A página deve ser um número inteiro positivo." })
      .optional()
      .default(1),
    limit: z.coerce.number({ message: "O limite deve ser um número inteiro positivo." })
      .int({ message: "O limite deve ser um número inteiro." })
      .positive({ message: "O limite deve ser pelo menos 1." })
      .default(10),
  });

  static updateGoal = z.object({
    name: z.string({ message: "O nome deve ser um texto." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "O nome deve conter palavras, não apenas números." })
      .optional(),
    date: z.string({ message: "A data deve ser uma string de data válida." })
      .refine((val) => !isNaN(Date.parse(val)), { message: "A data deve estar em um formato válido." })
      .optional(),
    transaction_type: z.enum(["expense", "income"], { 
      message: "O tipo de transação deve ser 'expense' ou 'income'." 
    }).optional(),
    value: z.coerce.number({ message: "O valor deve ser um número." })
      .positive({ message: "O valor deve ser maior que 0." })
      .optional()
  });

  static goalIdParam = z.object({
    id: z.coerce.number({ message: "O ID deve ser um número inteiro." })
      .int({ message: "O ID deve ser um número inteiro." })
      .positive({ message: "O ID deve ser pelo menos 1." })
  });

  static goalUserIdParam = z.object({
    userId: z.coerce.number({ message: "O ID do usuário deve ser um número inteiro." })
      .int({ message: "O ID do usuário deve ser um número inteiro." })
      .positive({ message: "O ID do usuário deve ser maior que 0." })
  });
}

export default GoalSchemas;
