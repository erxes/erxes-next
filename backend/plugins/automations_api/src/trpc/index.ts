import { initTRPC } from '@trpc/server';
import { automationsRouter } from './automations';
import { ITRPCContext } from 'erxes-api-shared/utils';

const t = initTRPC.context<ITRPCContext>().create({});

export const appRouter = t.mergeRouters(automationsRouter);
