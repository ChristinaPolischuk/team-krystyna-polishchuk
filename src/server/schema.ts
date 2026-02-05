// ... existing code ...
import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name is too short"),
  description: z.string(),
  price: z.number().positive("Price must be greater than 0"),
  category: z.string(),
  stock: z.number().int().nonnegative(),
  image: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;