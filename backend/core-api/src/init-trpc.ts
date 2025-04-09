import { initTRPC } from '@trpc/server';

import { customerRouter } from './modules/contacts/trpc/customer';
// import { userRouter } from '../../libs/api-rpc/src/core/user';

const t = initTRPC.create();

export const appRouter = t.mergeRouters(customerRouter);
