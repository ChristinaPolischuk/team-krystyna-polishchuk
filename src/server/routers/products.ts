import { router, publicProcedure } from '../trpc';
import { ProductSchema } from '../schema';
import fs from 'fs/promises';
import path from 'path';

export const productsRouter = router({
  // This is a procedure to get all products
  getProducts: publicProcedure
    .query(async () => {
      // Path to our JSON file
      const filePath = path.join(process.cwd(), 'data', 'products.json');
      
      // Reading the file
      const jsonData = await fs.readFile(filePath, 'utf-8');
      
      // Parsing the JSON data
      const products = JSON.parse(jsonData);
      
      return products as any[]; 
    }),
});