import { initTRPC } from '@trpc/server';
import { automationsRouter } from './automations';

const t = initTRPC.create();

export const appRouter = t.mergeRouters(automationsRouter);
