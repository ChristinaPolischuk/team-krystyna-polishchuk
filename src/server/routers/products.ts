import { z } from 'zod';
// Use publicProcedure instead of procedure
import { publicProcedure, router } from '../trpc';
import { ProductSchema } from '../schema';
import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'products.json');

// Helper to read the database file
async function readDB() {
  const data = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(data) as z.infer<typeof ProductSchema>[];
}

// Helper to write to the database file
async function writeDB(data: any) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
}

export const productsRouter = router({
  // READ: Fetch all products
  getProducts: publicProcedure.query(async () => {
    return await readDB();
  }),

  // CREATE: Add a new product
  addProduct: publicProcedure
    .input(ProductSchema.omit({ id: true }))
    .mutation(async ({ input }) => {
      const products = await readDB();
      const newProduct = { ...input, id: Date.now().toString() };
      await writeDB([...products, newProduct]);
      return newProduct;
    }),

  // UPDATE: Edit an existing product
  updateProduct: publicProcedure
    .input(ProductSchema)
    .mutation(async ({ input }) => {
      const products = await readDB();
      const updated = products.map((p) => (p.id === input.id ? input : p));
      await writeDB(updated);
      return input;
    }),

  // DELETE: Remove a product
  deleteProduct: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const products = await readDB();
      const filtered = products.filter((p) => p.id !== input.id);
      await writeDB(filtered);
      return { success: true };
    }),
});