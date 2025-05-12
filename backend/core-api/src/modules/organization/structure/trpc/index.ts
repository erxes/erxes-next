import { initTRPC } from '@trpc/server';
import { branchTrpcRouter } from './branch';
import { departmentTrpcRouter } from './department';
import { unitTrpcRouter } from './unit';

const t = initTRPC.create();

export const structureTrpcRouter = t.mergeRouters(
  branchTrpcRouter,
  departmentTrpcRouter,
  unitTrpcRouter,
);
