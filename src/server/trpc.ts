import { initTRPC } from '@trpc/server';

// Инициализация tRPC
const t = initTRPC.create();

// Экспортируем инструменты для создания роутеров и процедур
export const router = t.router;
export const publicProcedure = t.procedure;