import { z } from "zod";

class PaymentMethodsSchemas {
  static listPaymentMethods = z.object({
    id: z.coerce.number({ message: "The 'id' must be an integer." })
      .int({ message: "The 'id' must be an integer." })
      .positive({ message: "The 'id' must be at least 1." })
      .optional(),
    name: z.string({ message: "The name must be a text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The name must contain words, not only numbers." })
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
    static listAccountPaymentMethods = z.object({
    id: z.coerce.number({ message: "The 'id' must be an integer." })
      .int({ message: "The 'id' must be an integer." })
      .positive({ message: "The 'id' must be at least 1." })
      .optional(),
    accountId: z.coerce.number({ message: "The 'accountId' must be an integer." })
      .int({ message: "The 'accountId' must be an integer." })
      .positive({ message: "The 'accountId' must be at least 1." })
      .optional(),
    paymentMethodId: z.coerce.number({ message: "The 'paymentMethodId' must be an integer." })
      .int({ message: "The 'paymentMethodId' must be an integer." })
      .positive({ message: "The 'paymentMethodId' must be at least 1." })
      .optional(),
    accountName: z.string({ message: "The accountName must be a text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The accountName must contain words, not only numbers." })
      .optional(),
    paymentMethodName: z.string({ message: "The paymentMethodName must be a text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The paymentMethodName must contain words, not only numbers." })
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

  static createPaymentMethod = z.object({
    name: z.string({ message: "The name is required and must be a text." })
      .min(1, { message: "The name cannot be empty." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The name must contain words, not only numbers." })
  });

  static updatePaymentMethod = z.object({
    name: z.string({ message: "The name must be a text." })
      .min(1, { message: "The name cannot be empty." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The name must contain words, not only numbers." })
      .optional()
  });

  static getPaymentMethodById = z.object({
    id: z.coerce.number({ message: "The 'id' must be an integer." })
      .int({ message: "The 'id' must be an integer." })
      .positive({ message: "The 'id' must be at least 1." })
  });
}

export default PaymentMethodsSchemas;
