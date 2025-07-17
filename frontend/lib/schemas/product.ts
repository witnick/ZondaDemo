import { z } from 'zod';

export const productSchema = z.object({
  name: z.string()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters'),
  description: z.string()
    .min(1, 'Product description is required')
    .max(500, 'Product description must be less than 500 characters'),
  price: z.number()
    .min(0.01, 'Price must be greater than 0')
    .max(1000000, 'Price must be less than 1,000,000')
    .transform((val) => Number(val.toFixed(2))), // Ensure 2 decimal places
  stock: z.number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .default(0),
});

export type ProductFormData = z.infer<typeof productSchema>; 