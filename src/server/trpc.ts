import { initTRPC } from '@trpc/server';

// Initialize tRPC
const t = initTRPC.create();

// Export tools for creating routers and procedures
export const router = t.router;
export const publicProcedure = t.procedure;