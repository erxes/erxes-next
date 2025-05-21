import { initTRPC } from '@trpc/server';
import { ITRPCContext } from 'erxes-api-shared/utils';
import { permissionTrpcRouter as permissionRouter } from './permission';
import { userGroupTrpcRouter } from './userGroup';

const t = initTRPC.context<ITRPCContext>().create();

export const permissionTrpcRouter = t.mergeRouters(
  permissionRouter,
  userGroupTrpcRouter,
);
