import { startPlugin } from 'erxes-api-shared/utils';
import express from 'express';
import path from 'path';
import { typeDefs } from '~/apollo/typeDefs';
import { appRouter } from '~/trpc/init-trpc';
import resolvers from './apollo/resolvers';
import { generateModels } from './connectionResolvers';


startPlugin({
  name: 'payment',
  port: 33010,
  graphql: async () => ({
    typeDefs: await typeDefs(),
    resolvers,
  }),
  apolloServerContext: async (subdomain, context) => {
    const models = await generateModels(subdomain);

    context.models = models;
    context.subdomain = subdomain;

    return context;
  },
  trpcAppRouter: {
    router: appRouter,
    createContext: async (subdomain, context) => {
      const models = await generateModels(subdomain);

      context.models = models;
      context.subdomain = subdomain;

      return context;
    },
  },

  onServerInit: async (app) => {
    app.use('/static', express.static(path.join(__dirname, '/public')));  
    app.use('/widget', express.static(path.join(__dirname, '/public/widget')));  
    app.get('/widget/*', (req, res) => {
      res.sendFile(path.join(__dirname, '/public/widget/index.html'));
    });
  },
});
