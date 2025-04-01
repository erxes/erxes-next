import { initTRPC } from '@trpc/server';

import { contactRouter } from './contacts';

const t = initTRPC.create();

export const serviceRouter = t.mergeRouters(contactRouter);

export type CoreTRPCAppRouter = typeof serviceRouter;
