import { initTRPC } from '@trpc/server';

import { customerRouter } from '@/contacts/trpc/customer';

const t = initTRPC.create();

export const appRouter = t.mergeRouters(customerRouter);
