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
      .refine((val) => !isNaN(Date.parse(val)), { message: "A data deve estar em um formato válido. Use o formato YYYY-MM-DD para filtrar metas a partir do mês especificado até o final do ano." })
      .optional(),
    userId: z.coerce.number({ message: "O ID do usuário deve ser um número inteiro." })
      .int({ message: "O ID do usuário deve ser um número inteiro." })
      .positive({ message: "O ID do usuário deve ser maior que 0." }),
    page: z.coerce.number({ message: "A página deve ser um número inteiro." })
      .int({ message: "A página deve ser um número inteiro." })
      .positive({ message: "A página deve ser maior que 0." })
      .optional(),
    limit: z.coerce.number({ message: "O limite deve ser um número inteiro." })
      .int({ message: "O limite deve ser um número inteiro." })
      .positive({ message: "O limite deve ser maior que 0." })
      .max(100, { message: "O limite não pode ser maior que 100." })
      .optional()
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
