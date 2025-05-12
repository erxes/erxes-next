import { initTRPC } from '@trpc/server';
import { fieldsTrpcRouter } from './fields';

const t = initTRPC.create();

export const formsTrpcRouter = t.mergeRouters(fieldsTrpcRouter);
