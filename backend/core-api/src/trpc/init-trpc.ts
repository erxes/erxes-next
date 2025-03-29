import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

const serviceRouter = t.router({
  greet: t.procedure.query(() => {
    return { message: `Hello, dasdadsadadasds ` };
  }),
});

export const appRouter = serviceRouter;

export type AppRouter = typeof appRouter;
