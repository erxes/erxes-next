import { initTRPC } from '@trpc/server';
import { logsRouter } from './logs';
import { ITRPCContext } from 'erxes-api-shared/utils';

const t = initTRPC.context<ITRPCContext>().create();

export const appRouter = t.mergeRouters(logsRouter);
