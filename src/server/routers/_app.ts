import { router } from '../trpc';
import { productsRouter } from './products';

// This is the main router that combines all other routers
export const appRouter = router({
  products: productsRouter,
});

// Export the type of the router for the frontend
export type AppRouter = typeof appRouter;