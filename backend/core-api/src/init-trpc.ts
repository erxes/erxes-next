import { initTRPC } from '@trpc/server';

import * as trpcExpress from '@trpc/server/adapters/express';
import { OpenApiMeta } from 'trpc-openapi';

import { getSubdomain } from 'erxes-api-shared/utils';

import { contactRouter } from '~/modules/contacts/trpc';
import { relationTrpcRouter } from '~/modules/relations/trpc/relation';
import { conformityTrpcRouter } from '~/modules/conformities/trpc/conformity';
import { userTrpcRouter } from '~/modules/organization/team-member/trpc/user';
import { generateModels } from './connectionResolvers';

export const createContext = async ({
  req,
}: trpcExpress.CreateExpressContextOptions) => {
  const subdomain = getSubdomain(req);
  const models = await generateModels(subdomain);

  return {
    subdomain,
    models,
  };
};

export type ITRPCContext = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC
  .meta<OpenApiMeta>()
  .context<ITRPCContext>()
  .create({
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          customMessage: error.message,
        },
      };
    },
  });

export const appRouter = t.mergeRouters(
  contactRouter,
  conformityTrpcRouter,
  relationTrpcRouter,
  userTrpcRouter,
);

export type AppRouter = typeof appRouter;
