import { initTRPC } from '@trpc/server';
import { ITRPCContext } from 'erxes-api-shared/utils';
import { branchTrpcRouter } from './branch';
import { departmentTrpcRouter } from './department';
import { unitTrpcRouter } from './unit';

const t = initTRPC.context<ITRPCContext>().create();

export const structureTrpcRouter = t.mergeRouters(
  branchTrpcRouter,
  departmentTrpcRouter,
  unitTrpcRouter,
);
