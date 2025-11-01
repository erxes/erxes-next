import { initTRPC } from '@trpc/server';
import { CoreTRPCContext } from '~/init-trpc';
import { permissionTrpcRouter as permissionRouter } from './permission';
import { roleTrpcRouter } from './role';
import { userGroupTrpcRouter } from './userGroup';

const t = initTRPC.context<CoreTRPCContext>().create();

export const permissionTrpcRouter = t.mergeRouters(
  roleTrpcRouter,
  permissionRouter,
  userGroupTrpcRouter,
);
