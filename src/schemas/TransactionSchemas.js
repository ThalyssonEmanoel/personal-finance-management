import { z } from "zod";
class TransactionSchemas {
  static listTransaction = z.object({
    type: z.enum(["expense", "income"], { message: "Type must be 'expense' or 'income'." }).optional(),
    name: z.string({ message: "The name must be a text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The name must contain words, not only numbers." })
      .optional(),
    category: z.string({ message: "The category must be a text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The category must contain words, not only numbers." })
      .optional(),
    value: z.coerce.number({ message: "The value must be a number." }).optional(),
    release_date: z.string({ message: "The payment date must be a valid date string." })
      .refine((val) => !isNaN(Date.parse(val)), { message: "Payment date must be in a valid format." })
      .optional(),
    recurring: z.coerce.boolean({ message: "Recurring must be a boolean value." }).optional(),
    accountId: z.coerce.number({ message: "The accountId must be a number." })
      .int({ message: "The accountId must be an integer." })
      .positive({ message: "The accountId must be greater than 0." })
      .optional(),
    number_installments: z.coerce.number({ message: "The number of installments must be a number." })
      .int({ message: "The number of installments must be an integer." })
      .positive({ message: "The number of installments must be greater than 0." })
      .optional(),
    current_installment: z.coerce.number({ message: "The current installment number must be a number." })
      .int({ message: "The current installment number must be an integer." })
      .positive({ message: "The current installment number must be greater than 0." })
      .optional(),
    paymentMethodId: z.coerce.number({ message: "The payment method ID must be an integer." })
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

  static listTransactionUser = z.object({
    type: z.enum(["expense", "income"], { message: "Type must be 'expense' or 'income'." }).optional(),
    name: z.string({ message: "The name must be a text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The name must contain words, not only numbers." })
      .optional(),
    category: z.string({ message: "The category must be a text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The category must contain words, not only numbers." })
      .optional(),
    value: z.coerce.number({ message: "The value must be a number." }).optional(),
    release_date: z.string({ message: "The payment date must be a valid date string." })
      .refine((val) => !isNaN(Date.parse(val)), { message: "Payment date must be in a valid format." })
      .optional(),
    recurring: z.coerce.boolean({ message: "Recurring must be a boolean value." }).optional(),
    accountId: z.coerce.number({ message: "The accountId must be a number." })
      .int({ message: "The accountId must be an integer." })
      .positive({ message: "The accountId must be greater than 0." })
      .optional(),
    number_installments: z.coerce.number({ message: "The number of installments must be a number." })
      .int({ message: "The number of installments must be an integer." })
      .positive({ message: "The number of installments must be greater than 0." })
      .optional(),
    current_installment: z.coerce.number({ message: "The current installment number must be a number." })
      .int({ message: "The current installment number must be an integer." })
      .positive({ message: "The current installment number must be greater than 0." })
      .optional(),
    paymentMethodId: z.coerce.number({ message: "The payment method ID must be an integer." })
      .int({ message: "The payment method ID must be an integer." })
      .positive({ message: "The payment method ID must be greater than 0." })
      .optional(),
    userId: z.coerce.number({ message: "The user ID must be an integer." })
      .int({ message: "The user ID must be an integer." })
      .positive({ message: "The user ID must be greater than 0." }),
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
    type: z.enum(["expense", "income"], { message: "Type must be 'expense' or 'income'." }),
    name: z.string({ message: "The name is required and must be a text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The name must contain words, not only numbers." }),
    category: z.string({ message: "The category is required and must be a text." }),
    value: z.coerce.number({ message: "The value is required and must be a number." })
      .positive({ message: "The value must be greater than 0." }),
    value_installment: z.coerce.number({ message: "The installment total value must be a number." })
      .positive({ message: "The installment total value must be greater than 0." })
      .optional(), // Agora é opcional pois é calculado automaticamente
    release_date: z.string({ message: "The payment date is required." })
      .refine((val) => !isNaN(Date.parse(val)), { message: "Payment date must be in a valid format." }),
    number_installments: z.coerce.number({ message: "The number of installments must be a number." })
      .int({ message: "The number of installments must be an integer." })
      .positive({ message: "The number of installments must be greater than 0." })
      .optional(),
    current_installment: z.coerce.number({ message: "The current installment number must be a number." })
      .int({ message: "The current installment number must be an integer." })
      .positive({ message: "The current installment number must be greater than 0." })
      .optional(), // Agora é opcional pois é definido automaticamente como 1
    description: z.string({ message: "The description must be a text." }).optional(),
    recurring: z.coerce.boolean({ message: "Recurring must be a boolean value." }).default(false),
    accountId: z.coerce.number({ message: "The account ID is required and must be an integer." })
      .int({ message: "The account ID must be an integer." })
      .positive({ message: "The account ID must be greater than 0." }),
    paymentMethodId: z.coerce.number({ message: "The payment method ID is required and must be an integer." })
      .int({ message: "The payment method ID must be an integer." })
      .positive({ message: "The payment method ID must be greater than 0." }),
    userId: z.coerce.number({ message: "The user ID is required and must be an integer." })
      .int({ message: "The user ID must be an integer." })
      .positive({ message: "The user ID must be greater than 0." })
  });

  static createTransactionRequest = z.object({
    type: z.enum(["expense", "income"], { message: "Type must be 'expense' or 'income'." }),
    name: z.string({ message: "The name is required and must be a text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The name must contain words, not only numbers." }),
    category: z.string({ message: "The category is required and must be a text." }),
    value: z.coerce.number({ message: "The value is required and must be a number." })
      .positive({ message: "The value must be greater than 0." }),
    // value_installment e current_installment foram removidos - agora são calculados automaticamente
    release_date: z.string({ message: "The payment date is required." })
      .refine((val) => !isNaN(Date.parse(val)), { message: "Payment date must be in a valid format." }),
    number_installments: z.coerce.number({ message: "The number of installments must be a number." })
      .int({ message: "The number of installments must be an integer." })
      .positive({ message: "The number of installments must be greater than 0." })
      .optional(),
    description: z.string({ message: "The description must be a text." }).optional(),
    recurring: z.coerce.boolean({ message: "Recurring must be a boolean value." }).default(false),
    accountId: z.coerce.number({ message: "The account ID is required and must be an integer." })
      .int({ message: "The account ID must be an integer." })
      .positive({ message: "The account ID must be greater than 0." }),
    paymentMethodId: z.coerce.number({ message: "The payment method ID is required and must be an integer." })
      .int({ message: "The payment method ID must be an integer." })
      .positive({ message: "The payment method ID must be greater than 0." }),
  });

  static createTransactionQuery = z.object({
    userId: z.coerce.number({ message: "The user ID is required and must be an integer." })
      .int({ message: "The user ID must be an integer." })
      .positive({ message: "The user ID must be greater than 0." })
  });

  static updateTransaction = z.object({
    type: z.enum(["expense", "income"], { message: "Type must be 'expense' or 'income'." }).optional(),
    name: z.string({ message: "The name must be a text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The name must contain words, not only numbers." })
      .optional(),
    category: z.string({ message: "The category must be a text." }).optional(),
    value: z.coerce.number({ message: "The value must be a number." })
      .positive({ message: "The value must be greater than 0." })
      .optional(),
    release_date: z.string({ message: "The payment date must be a valid date string." })
      .refine((val) => !isNaN(Date.parse(val)), { message: "Payment date must be in a valid format." })
      .optional(),
    number_installments: z.coerce.number({ message: "The number of installments must be a number." })
      .int({ message: "The number of installments must be an integer." })
      .positive({ message: "The number of installments must be greater than 0." })
      .optional(),
    current_installment: z.coerce.number({ message: "The current installment number must be a number." })
      .int({ message: "The current installment number must be an integer." })
      .positive({ message: "The current installment number must be greater than 0." })
      .optional(),
    description: z.string({ message: "The description must be a text." }).optional(),
    recurring: z.coerce.boolean({ message: "Recurring must be a boolean value." }).optional(),
    accountId: z.coerce.number({ message: "The account ID must be an integer." })
      .int({ message: "The account ID must be an integer." })
      .positive({ message: "The account ID must be greater than 0." })
      .optional(),
    paymentMethodId: z.coerce.number({ message: "The payment method ID must be an integer." })
      .int({ message: "The payment method ID must be an integer." })
      .positive({ message: "The payment method ID must be greater than 0." })
      .optional(),
    userId: z.coerce.number({ message: "The user ID must be an integer." })
      .int({ message: "The user ID must be an integer." })
      .positive({ message: "The user ID must be greater than 0." })
      .optional()
  });

  static transactionIdParam = z.object({
    id: z.coerce.number({ message: "The 'id' must be an integer." })
      .int({ message: "The 'id' must be an integer." })
      .positive({ message: "The 'id' must be at least 1." })
  });

  static accountIdParam = z.object({
    accountId: z.coerce.number({ message: "The 'accountId' must be an integer." })
      .int({ message: "The 'accountId' must be an integer." })
      .positive({ message: "The 'accountId' must be at least 1." })
  });
}
export default TransactionSchemas;