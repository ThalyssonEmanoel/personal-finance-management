import { z } from "zod";

class AccountSchemas {
  static listAccount = z.object({
    name: z.string({ message: "The account name must be a string/text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The account name must contain words, not only numbers." })
      .optional(),
    type: z.string({ message: "The type must be a string/text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The type must contain words, not only numbers." })
      .optional(),
    balance: z.coerce.number({ message: "The balance must be a number." }).optional(),
    userId: z.coerce.number({ message: "The user ID must be an integer." })
      .int({ message: "The user ID must be an integer." })
      .positive({ message: "The user ID must be greater than 0." })
      .optional(),
    id: z.coerce.number({ message: "The 'id' field must be an integer." })
      .int({ message: "The 'id' field must be an integer." })
      .positive({ message: "The 'id' field must be at least 1." })
      .optional(),
    page: z.coerce.number({ message: "The page must be a positive integer." })
      .int({ message: "The page must be a positive integer." })
      .positive({ message: "The page must be a positive integer." })
      .optional()
      .default(1),
    limit: z.coerce.number({ message: "The limit must be a positive integer." })
      .int({ message: "The 'limit' field must be an integer." })
      .positive({ message: "The 'limit' field must be at least 1." }).optional(),
  });

  static createAccount = z.object({
    name: z.string({ message: "The account name must be a string/text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The account name must be a string/text." }),
    type: z.string({ message: "Account type must be a string." }),
    balance: z.coerce.number({ message: "Account balance must be a number." }),
    icon: z.string({ message: "O icon precisa ser definido como uma string/texto." }).optional().nullable(),
    paymentMethodIds: z.union([
      z.string(),
      z.undefined(),
      z.null(),
      z.array(z.number())
    ], { message: "Payment method IDs must be a string, array, or empty." })
      .optional()
      .transform((val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val.filter(id => !isNaN(id) && id > 0);
        if (val.toString().trim() === "" || val === "undefined" || val === "null") return [];
        return val.toString().split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id) && id > 0);
      }),
    userId: z.coerce.number({ message: "User ID must be an integer." })
      .int({ message: "User ID must be an integer." })
      .positive({ message: "User ID must be at least 1." })
  });

  static createAccountBody = z.object({
    name: z.string({ message: "The account name must be a string/text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The account name must be a string/text." }),
    type: z.string({ message: "Account type must be a string." }),
    balance: z.coerce.number({ message: "Account balance must be a number." }),
    icon: z.string({ message: "O icon precisa ser definido como uma string/texto." }).optional().nullable(),
    paymentMethodIds: z.union([
      z.string(),
      z.undefined(),
      z.null()
    ], { message: "Payment method IDs must be a string or empty." })
      .optional()
      .transform((val) => {
        if (!val || val.toString().trim() === "" || val === "undefined" || val === "null") return [];
        return val.toString().split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id) && id > 0);
      })
  });

  static createAccountQuery = z.object({
    userId: z.coerce.number({ message: "User ID must be an integer." })
      .int({ message: "User ID must be an integer." })
      .positive({ message: "User ID must be at least 1." })
  });

  static updateAccount = z.object({
    name: z.string({ message: "The account name must be a string/text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The account name must contain words, not only numbers." })
      .optional(),
    type: z.string({ message: "The type must be a string/text." }).optional(),
    balance: z.coerce.number({ message: "The balance must be a number." }).optional(),
    icon: z.string({ message: "O icon precisa ser definido como uma string/texto." }).optional().nullable(),
    paymentMethodIds: z.string({ message: "Payment method IDs must be a string." })
      .optional()
      .transform((val) => {
        if (!val || val.trim() === "") return [];
        return val.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id) && id > 0);
      })
  });

  static accountIdParam = z.object({
    id: z.coerce.number({ message: "The 'id' field must be an integer." })
      .int({ message: "The 'id' field must be an integer." })
      .positive({ message: "The 'id' field must be at least 1." })
  });

  static userIdParam = z.object({
    userId: z.coerce.number({ message: "The 'id' field must be an integer." })
      .int({ message: "The 'id' field must be an integer." })
      .positive({ message: "The 'id' field must be at least 1." })
  });

  static listAccountUser = z.object({
    name: z.string({ message: "The account name must be a string/text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The account name must contain words, not only numbers." })
      .optional(),
    type: z.string({ message: "The type must be a string/text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The type must contain words, not only numbers." })
      .optional(),
    balance: z.coerce.number({ message: "The balance must be a number." }).optional(),
    userId: z.coerce.number({ message: "The user ID must be an integer." })
      .int({ message: "The user ID must be an integer." })
      .positive({ message: "The user ID must be greater than 0." }),
    id: z.coerce.number({ message: "The 'id' field must be an integer." })
      .int({ message: "The 'id' field must be an integer." })
      .positive({ message: "The 'id' field must be at least 1." })
      .optional(),
    page: z.coerce.number({ message: "The page must be a positive integer." })
      .int({ message: "The page must be a positive integer." })
      .positive({ message: "The page must be a positive integer." })
      .optional()
      .default(1),
    limit: z.coerce.number({ message: "The limit must be a positive integer." })
      .int({ message: "The 'limit' field must be an integer." })
      .positive({ message: "The 'limit' field must be at least 1." }).optional(),
  });
}

export default AccountSchemas;