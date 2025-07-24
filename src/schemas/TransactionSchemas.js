import { z } from "zod";

class TransactionSchemas {
  static listTransaction = z.object({
    tipo: z.enum(["despesa", "receita", "Despesa", "Receita"], { message: "Type must be 'despesa' or 'receita'." }).optional(),
    nome: z.string({ message: "The name must be a text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The name must contain words, not only numbers." })
      .optional(),
    categoria: z.string({ message: "The category must be a text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The category must contain words, not only numbers." })
      .optional(),
    subcategoria: z.string({ message: "The subcategory must be a text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The subcategory must contain words, not only numbers." })
      .optional(),
    valor: z.coerce.number({ message: "The value must be a number." }).optional(),
    data_pagamento: z.string({ message: "The payment date must be a valid date string." })
      .refine((val) => !isNaN(Date.parse(val)), { message: "Payment date must be in a valid format." })
      .optional(),
    recorrente: z.coerce.boolean({ message: "Recurring must be a boolean value." }).optional(),
    contaId: z.coerce.number({ message: "The account ID must be an integer." })
      .int({ message: "The account ID must be an integer." })
      .positive({ message: "The account ID must be greater than 0." })
      .optional(),
    dia_cobranca: z.coerce.number({ message: "The billing day must be a number." })
      .int({ message: "The billing day must be an integer." })
      .min(1, { message: "The billing day must be between 1 and 31." })
      .max(31, { message: "The billing day must be between 1 and 31." })
      .optional(),
    quantidade_parcelas: z.coerce.number({ message: "The number of installments must be a number." })
      .int({ message: "The number of installments must be an integer." })
      .positive({ message: "The number of installments must be greater than 0." })
      .optional(),
    parcela_atual: z.coerce.number({ message: "The current installment number must be a number." })
      .int({ message: "The current installment number must be an integer." })
      .positive({ message: "The current installment number must be greater than 0." })
      .optional(),  
    formaPagamentoId: z.coerce.number({ message: "The payment method ID must be an integer." })
      .int({ message: "The payment method ID must be an integer." })
      .positive({ message: "The payment method ID must be greater than 0." })
      .optional(),
    userId: z.coerce.number({ message: "The user ID must be an integer." })
      .int({ message: "The user ID must be an integer." })
      .positive({ message: "The user ID must be greater than 0." })
      .optional(),
    id: z.coerce.number({ message: "The 'id' must be an integer." })
      .int({ message: "The 'id' must be an integer." })
      .positive({ message: "The 'id' must be at least 1." })
      .optional(),
    page: z.coerce.number({ message: "The page must be a positive integer." })
      .int({ message: "The page must be a positive integer." })
      .positive({ message: "The page must be a positive integer." })
      .optional()
      .default(1),
    limit: z.coerce.number({ message: "The limit must be a positive integer." })
      .int({ message: "The 'limit' must be an integer." })
      .positive({ message: "The 'limit' must be at least 1." })
      .default(10),
  });

  static createTransaction = z.object({
    tipo: z.enum(["despesa", "receita"], { message: "Type must be 'despesa' or 'receita'." }),
    nome: z.string({ message: "The name is required and must be a text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The name must contain words, not only numbers." }),
    categoria: z.string({ message: "The category is required and must be a text." }),
    subcategoria: z.string({ message: "The subcategory must be a text." }).optional(),
    valor: z.coerce.number({ message: "The value is required and must be a number." })
      .positive({ message: "The value must be greater than 0." }),
    data_pagamento: z.string({ message: "The payment date is required." })
      .refine((val) => !isNaN(Date.parse(val)), { message: "Payment date must be in a valid format." }),
    dia_cobranca: z.coerce.number({ message: "The billing day must be a number." })
      .int({ message: "The billing day must be an integer." })
      .min(1, { message: "The billing day must be between 1 and 31." })
      .max(31, { message: "The billing day must be between 1 and 31." })
      .optional(),
    quantidade_parcelas: z.coerce.number({ message: "The number of installments must be a number." })
      .int({ message: "The number of installments must be an integer." })
      .positive({ message: "The number of installments must be greater than 0." })
      .optional(),
    recorrente: z.coerce.boolean({ message: "Recurring must be a boolean value." }).default(false),
    contaId: z.coerce.number({ message: "The account ID is required and must be an integer." })
      .int({ message: "The account ID must be an integer." })
      .positive({ message: "The account ID must be greater than 0." }),
    formaPagamentoId: z.coerce.number({ message: "The payment method ID is required and must be an integer." })
      .int({ message: "The payment method ID must be an integer." })
      .positive({ message: "The payment method ID must be greater than 0." }),
    userId: z.coerce.number({ message: "The user ID is required and must be an integer." })
      .int({ message: "The user ID must be an integer." })
      .positive({ message: "The user ID must be greater than 0." })
  });

  static updateTransaction = z.object({
    tipo: z.enum(["despesa", "receita"], { message: "Type must be 'despesa' or 'receita'." }).optional(),
    nome: z.string({ message: "The name must be a text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The name must contain words, not only numbers." })
      .optional(),
    categoria: z.string({ message: "The category must be a text." }).optional(),
    subcategoria: z.string({ message: "The subcategory must be a text." }).optional(),
    valor: z.coerce.number({ message: "The value must be a number." })
      .positive({ message: "The value must be greater than 0." })
      .optional(),
    data_pagamento: z.string({ message: "The payment date must be a valid date string." })
      .refine((val) => !isNaN(Date.parse(val)), { message: "Payment date must be in a valid format." })
      .optional(),
    dia_cobranca: z.coerce.number({ message: "The billing day must be a number." })
      .int({ message: "The billing day must be an integer." })
      .min(1, { message: "The billing day must be between 1 and 31." })
      .max(31, { message: "The billing day must be between 1 and 31." })
      .optional(),
    quantidade_parcelas: z.coerce.number({ message: "The number of installments must be a number." })
      .int({ message: "The number of installments must be an integer." })
      .positive({ message: "The number of installments must be greater than 0." })
      .optional(),
    recorrente: z.coerce.boolean({ message: "Recurring must be a boolean value." }).optional(),
    contaId: z.coerce.number({ message: "The account ID must be an integer." })
      .int({ message: "The account ID must be an integer." })
      .positive({ message: "The account ID must be greater than 0." })
      .optional(),
    formaPagamentoId: z.coerce.number({ message: "The payment method ID must be an integer." })
      .int({ message: "The payment method ID must be an integer." })
      .positive({ message: "The payment method ID must be greater than 0." })
      .optional()
  });

  static transactionIdParam = z.object({
    id: z.coerce.number({ message: "The 'id' must be an integer." })
      .int({ message: "The 'id' must be an integer." })
      .positive({ message: "The 'id' must be at least 1." })
  });
}
export default TransactionSchemas;