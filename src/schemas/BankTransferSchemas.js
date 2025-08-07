import { z } from "zod";

class BankTransferSchemas {
  static listBankTransfer = z.object({
    sourceAccountId: z.coerce.number({ message: "The source account ID must be an integer." })
      .int({ message: "The source account ID must be an integer." })
      .positive({ message: "The source account ID must be greater than 0." })
      .optional(),
    destinationAccountId: z.coerce.number({ message: "The destination account ID must be an integer." })
      .int({ message: "The destination account ID must be an integer." })
      .positive({ message: "The destination account ID must be greater than 0." })
      .optional(),
    amount: z.coerce.number({ message: "The amount must be a number." }).optional(),
    transfer_date: z.string({ message: "The transfer date must be a valid date string." })
      .refine((val) => !isNaN(Date.parse(val)), { message: "Transfer date must be in a valid format." })
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

  static listBankTransferUser = z.object({
    sourceAccountId: z.coerce.number({ message: "The source account ID must be an integer." })
      .int({ message: "The source account ID must be an integer." })
      .positive({ message: "The source account ID must be greater than 0." })
      .optional(),
    destinationAccountId: z.coerce.number({ message: "The destination account ID must be an integer." })
      .int({ message: "The destination account ID must be an integer." })
      .positive({ message: "The destination account ID must be greater than 0." })
      .optional(),
    amount: z.coerce.number({ message: "The amount must be a number." }).optional(),
    transfer_date: z.string({ message: "The transfer date must be a valid date string." })
      .refine((val) => !isNaN(Date.parse(val)), { message: "Transfer date must be in a valid format." })
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

  static createBankTransfer = z.object({
    amount: z.coerce.number({ message: "The amount is required and must be a number." })
      .positive({ message: "The amount must be greater than 0." }),
    transfer_date: z.string({ message: "The transfer date is required." })
      .refine((val) => !isNaN(Date.parse(val)), { message: "Transfer date must be in a valid format." }),
    description: z.string({ message: "The description must be a text." }).optional(),
    sourceAccountId: z.coerce.number({ message: "The source account ID is required and must be an integer." })
      .int({ message: "The source account ID must be an integer." })
      .positive({ message: "The source account ID must be greater than 0." }),
    destinationAccountId: z.coerce.number({ message: "The destination account ID is required and must be an integer." })
      .int({ message: "The destination account ID must be an integer." })
      .positive({ message: "The destination account ID must be greater than 0." }),
    paymentMethodId: z.coerce.number({ message: "The payment method ID is required and must be an integer." })
      .int({ message: "The payment method ID must be an integer." })
      .positive({ message: "The payment method ID must be greater than 0." }),
    userId: z.coerce.number({ message: "The user ID is required and must be an integer." })
      .int({ message: "The user ID must be an integer." })
      .positive({ message: "The user ID must be greater than 0." })
  }).refine((data) => data.sourceAccountId !== data.destinationAccountId, {
    message: "Source account and destination account cannot be the same.",
    path: ["destinationAccountId"]
  });

  static createBankTransferRequest = z.object({
    amount: z.coerce.number({ message: "The amount is required and must be a number." })
      .positive({ message: "The amount must be greater than 0." }),
    transfer_date: z.string({ message: "The transfer date is required." })
      .refine((val) => !isNaN(Date.parse(val)), { message: "Transfer date must be in a valid format." }),
    description: z.string({ message: "The description must be a text." }).optional(),
    sourceAccountId: z.coerce.number({ message: "The source account ID is required and must be an integer." })
      .int({ message: "The source account ID must be an integer." })
      .positive({ message: "The source account ID must be greater than 0." }),
    destinationAccountId: z.coerce.number({ message: "The destination account ID is required and must be an integer." })
      .int({ message: "The destination account ID must be an integer." })
      .positive({ message: "The destination account ID must be greater than 0." }),
    paymentMethodId: z.coerce.number({ message: "The payment method ID is required and must be an integer." })
      .int({ message: "The payment method ID must be an integer." })
      .positive({ message: "The payment method ID must be greater than 0." }),
  }).refine((data) => data.sourceAccountId !== data.destinationAccountId, {
    message: "Source account and destination account cannot be the same.",
    path: ["destinationAccountId"]
  });

  static createBankTransferQuery = z.object({
    userId: z.coerce.number({ message: "The user ID is required and must be an integer." })
      .int({ message: "The user ID must be an integer." })
      .positive({ message: "The user ID must be greater than 0." })
  });

  static updateBankTransfer = z.object({
    amount: z.coerce.number({ message: "The amount must be a number." })
      .positive({ message: "The amount must be greater than 0." })
      .optional(),
    transfer_date: z.string({ message: "The transfer date must be a valid date string." })
      .refine((val) => !isNaN(Date.parse(val)), { message: "Transfer date must be in a valid format." })
      .optional(),
    description: z.string({ message: "The description must be a text." }).optional(),
    sourceAccountId: z.coerce.number({ message: "The source account ID must be an integer." })
      .int({ message: "The source account ID must be an integer." })
      .positive({ message: "The source account ID must be greater than 0." })
      .optional(),
    destinationAccountId: z.coerce.number({ message: "The destination account ID must be an integer." })
      .int({ message: "The destination account ID must be an integer." })
      .positive({ message: "The destination account ID must be greater than 0." })
      .optional(),
    paymentMethodId: z.coerce.number({ message: "The payment method ID must be an integer." })
      .int({ message: "The payment method ID must be an integer." })
      .positive({ message: "The payment method ID must be greater than 0." })
      .optional(),
  }).refine((data) => {
    if (data.sourceAccountId && data.destinationAccountId) {
      return data.sourceAccountId !== data.destinationAccountId;
    }
    return true;
  }, {
    message: "Source account and destination account cannot be the same.",
    path: ["destinationAccountId"]
  });

  static bankTransferIdParam = z.object({
    id: z.coerce.number({ message: "The 'id' must be an integer." })
      .int({ message: "The 'id' must be an integer." })
      .positive({ message: "The 'id' must be at least 1." })
  });
}

export default BankTransferSchemas;
