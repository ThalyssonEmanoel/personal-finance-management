import { z } from "zod";

class AccountSchemas {
  static listAccount = z.object({
    name: z.string({ message: "The account name must be a string/text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The account name must contain words, not only numbers." })
      .optional(),
    type: z.string({ message: "The type must be a string/text." }).optional(),
    balance: z.coerce.number({ message: "The balance must be a number." }).optional(),
    userName: z.string({ message: "The user name must be a string/text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The user name must contain words, not only numbers." })
      .optional(),
    id: z.coerce.number({ message: "The 'id' field must be an integer." })
      .int({ message: "The 'id' field must be an integer." })
      .positive({ message: "The 'id' field must be at least 1." })
      .optional(),
    page: z.number({ message: "The page must be a positive integer." })
      .int({ message: "The page must be a positive integer." })
      .positive({ message: "The page must be a positive integer." })
      .optional()
      .default(1),
    limit: z.number({ message: "The limit must be a positive integer." })
      .int({ message: "The 'limit' field must be an integer." })
      .positive({ message: "The 'limit' field must be at least 1." })
      .default(10),
  });

  static createAccount = z.object({
    name: z.string({ message: "The account name must be a string/text." })
      .refine((val) => !/^[0-9]+$/.test(val), { message: "The account name must be a string/text." }),
    type: z.string({ message: "Account type must be a string." }),
    balance: z.coerce.number({ message: "Account balance must be a number." }),
    icon: z.string({ message: "Account icon must be a string (image path)." })
      .regex(/\.(jpg|jpeg|png|gif|bmp|webp)$/i, { message: "Icon must be an image file (jpg, jpeg, png, gif, bmp, webp)." })
      .optional()
      .nullable()
      .or(z.literal("")),
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
    icon: z.string({ message: "The icon must be a string/text." }).optional(),
  });

  static accountIdParam = z.object({
    id: z.coerce.number({ message: "The 'id' field must be an integer." })
      .int({ message: "The 'id' field must be an integer." })
      .positive({ message: "The 'id' field must be at least 1." })
  });
}

export default AccountSchemas;