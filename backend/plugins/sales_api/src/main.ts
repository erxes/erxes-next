import * as trpcExpress from '@trpc/server/adapters/express';
import cookieParser from 'cookie-parser';
import {
  createTRPCContext,
  joinErxesGateway,
  leaveErxesGateway,
  startPlugin,
} from 'erxes-api-shared/utils';
import express from 'express';
import * as http from 'http';
import mongoose from 'mongoose';
import { appRouter } from '~/trpc/init-trpc';
import { typeDefs } from './apollo/typeDefs';
import { generateModels } from './connectionResolvers';
import resolvers from './apollo/resolvers';
startPlugin({
  name: 'sales',
  port: 3305,
  graphql: async () => ({
    typeDefs: await typeDefs(),
    resolvers: resolvers,
  }),
  apolloServerContext: async (subdomain, context) => {
    const models = await generateModels(subdomain);

    context.models = models;

    return context;
  },
  trpcAppRouter: {
    router: appRouter,
    createContext: async (subdomain, context) => {
      const models = await generateModels(subdomain);

      context.models = models;

      return context;
    },
  },
});
