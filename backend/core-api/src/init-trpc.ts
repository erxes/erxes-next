import { initTRPC } from '@trpc/server';

import * as trpcExpress from '@trpc/server/adapters/express';

import { getSubdomain } from 'erxes-api-shared/utils';

import { conformityTrpcRouter } from '~/modules/conformities/trpc/conformity';
import { contactTrpcRouter } from '~/modules/contacts/trpc';
import { exchangeRateTrpcRouter } from '~/modules/exchangeRates/trpc/exchangeRate';
import { brandTrpcRouter } from '~/modules/organization/brand/trpc/brand';
import { configTrpcRouter } from '~/modules/organization/settings/trpc/config';
import { structureTrpcRouter } from '~/modules/organization/structure/trpc';
import { userTrpcRouter } from '~/modules/organization/team-member/trpc/user';
import { productTrpcRouter } from '~/modules/products/trpc';
import { relationTrpcRouter } from '~/modules/relations/trpc/relation';
import { tagTrpcRouter } from '~/modules/tags/trpc/tag';
import { generateModels } from './connectionResolvers';
import { formsTrpcRouter } from './modules/forms/trpc';
import { permissionTrpcRouter } from './modules/permissions/trpc';

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

const t = initTRPC.context<ITRPCContext>().create({});

export const appRouter = t.mergeRouters(
  configTrpcRouter,
  formsTrpcRouter,
  contactTrpcRouter,
  conformityTrpcRouter,
  relationTrpcRouter,
  userTrpcRouter,
  structureTrpcRouter,
  productTrpcRouter,
  brandTrpcRouter,
  tagTrpcRouter,
  exchangeRateTrpcRouter,
  permissionTrpcRouter,
);

export type AppRouter = typeof appRouter;
