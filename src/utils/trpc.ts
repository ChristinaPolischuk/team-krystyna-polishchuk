import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/routers/_app';

// Create the tRPC hooks for the client
export const trpc = createTRPCReact<AppRouter>();