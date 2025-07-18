import { z } from "zod";

export const customerDetailSchema = z.object({
  address: z.string().min(1, "Address is required"),
  notes: z.string().optional(),
});

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  detail: customerDetailSchema,
});

export type CustomerFormData = z.infer<typeof customerSchema>; 