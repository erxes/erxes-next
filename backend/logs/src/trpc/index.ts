import { initTRPC } from '@trpc/server';
import { logsRouter } from './logs';

const t = initTRPC.create();

export const appRouter = t.mergeRouters(logsRouter);
