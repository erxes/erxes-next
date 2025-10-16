import { createTRPCContext, initializePluginConfig } from '@/utils';
import {
  AutomationConfigs,
  IAutomationContext,
  TAutomationProducerNames,
  TAutomationProducers,
} from './types';
import { Express } from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { AnyProcedure, initTRPC } from '@trpc/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';

export const startAutomations = async (
  app: Express,
  pluginName: string,
  config: AutomationConfigs,
) => {
  await initializePluginConfig(pluginName, 'automations', config);
  const t = initTRPC.context<IAutomationContext>().create();

  const {
    receiveActions,
    getRecipientsEmails,
    replacePlaceHolders,
    checkCustomTrigger,
  } = config || {};

  const automationProcedures: Partial<
    Record<TAutomationProducerNames, AnyProcedure>
  > = {};

  if (receiveActions) {
    automationProcedures.receiveActions = t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => receiveActions(ctx, input));
  }

  if (getRecipientsEmails) {
    automationProcedures.getRecipientsEmails = t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => getRecipientsEmails(ctx, input));
  }

  if (replacePlaceHolders) {
    automationProcedures.replacePlaceHolders = t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => replacePlaceHolders(ctx, input));
  }

  if (checkCustomTrigger) {
    automationProcedures.checkCustomTrigger = t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => checkCustomTrigger(ctx, input));
  }

  const automationsRouter = t.router(automationProcedures);

  const trpcMiddleware = trpcExpress.createExpressMiddleware({
    router: automationsRouter,
    createContext: createTRPCContext<IAutomationContext>(
      async (_subdomain, context) => {
        const processId = nanoid(12);

        context.processId = processId;

        return context;
      },
    ),
  });

  app.use('/automations', trpcMiddleware);

  // return new Promise<void>((resolve, reject) => {
  //   try {
  //     createMQWorkerWithListeners(
  //       pluginName,
  //       'automations',
  //       async ({ name, id, data: jobData }) => {
  //         try {
  //           const { subdomain, data } = jobData;

  //           if (!subdomain) {
  //             throw new Error('You should provide subdomain on message');
  //           }

  //           const resolverName = name as keyof AutomationConfigs;

  //           if (
  //             !(name in config) ||
  //             typeof config[resolverName] !== 'function'
  //           ) {
  //             throw new Error(`Automations method ${name} not registered`);
  //           }

  //           const resolver = config[resolverName];

  //           return await resolver({ subdomain }, data);
  //         } catch (error: any) {
  //           console.error(`Error processing job ${id}: ${error.message}`);
  //           throw error;
  //         }
  //       },
  //       redis,
  //       () => {
  //         resolve();
  //       },
  //     );
  //   } catch (error) {
  //     reject(error);
  //   }
  // });
};
