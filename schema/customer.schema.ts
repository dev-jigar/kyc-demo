import { z } from "zod";

export const addCustomerSchema = z.object({
  firstName: z.string().trim().optional(),

  lastName: z.string().trim().optional(),

  email: z.string().trim().email("Invalid email address").optional(),

  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || /^[+]?[\d\s().-]{6,20}$/.test(val),
      "Invalid phone number",
    ),

  message: z.string().trim().optional(),
});
