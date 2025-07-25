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
}

export default PaymentMethodsSchemas;
