import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ITRPCContext } from 'erxes-api-shared/utils';
import { IModels } from '~/connectionResolvers'
import {receiveTrpcMessage ,receiveIntegrationsNotification} from '@/inbox/receiveMessage'
import { getIntegrationsKinds} from '@/inbox/utils'
import { sendNotifications} from '@/inbox/graphql/resolvers/mutations/conversations'
import {pConversationClientMessageInserted} from '@/inbox/graphql/resolvers/mutations/widget'
import {
  IConversationDocument,
} from '@/inbox/@types/conversations';
import { cursorPaginate } from 'erxes-api-shared/utils';
const createConversationAndMessage = async (
  models: IModels,
  userId,
  status,
  customerId,
  visitorId,
  integrationId,
  content,
  engageData,
  formWidgetData
) => {
  // create conversation
  const conversation = await models.Conversations.createConversation({
    userId,
    status,
    customerId,
    visitorId,
    integrationId,
    content
  });

  // create message
  return await models.ConversationMessages.createMessage({
    engageData,
    formWidgetData,
    conversationId: conversation._id,
    userId,
    customerId,
    visitorId,
    content
  });
};
const t = initTRPC.context<ITRPCContext>().create();

export const inboxTrpcRouter = t.router({
  inbox: t.router({
    createConversationAndMessage:t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { 
        userId,
        status,
        customerId,
        visitorId,
        integrationId,
        content,
        engageData,
        formWidgetData } = input;
        const { models } = ctx;
          const response = await createConversationAndMessage(
            models,
            userId,
            status,
            customerId,
            visitorId,
            integrationId,
            content,
            engageData,
            formWidgetData
          );
        return { data: response, status: "success" };
      }),
  
    createOnlyMessage: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const {  
        conversationId,
        content,
        userId,
        customerId,
        internal,
        contentType } = input;
        const { models } = ctx;

      return {
        status: "success",
        data: await models.ConversationMessages.createMessage({
          conversationId,
          internal,
          userId,
          customerId,
          content,
          contentType
        })
      };
   }),

   integrationsNotification: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
      const { subdomain } = ctx;
      return receiveIntegrationsNotification(subdomain, input);
    }),
  
    getConversations: t.procedure
      .input(z.any())
      .query(async ({ ctx, input }) => {
        const { query } = input;
        const { models } = ctx;
        return {
        status: "success",
        data: await models.Conversations.find(query).lean()
      };
      }),
    removeCustomersConversations: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { customerIds } = input;
        const { models } = ctx;

        return await models.Conversations.removeCustomersConversations(
          customerIds,
        );
      }),
    changeCustomer: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { customerId, customerIds } = input;
        const { models } = ctx;

        return await models.Conversations.changeCustomer(
          customerId,
          customerIds,
        );
      }),

    updateConversationMessage: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { filter, updateDoc } = input;
        const { models } = ctx;

       const updated = await models.ConversationMessages.updateOne(filter, {
          $set: updateDoc
        });
        return {
          data: updated,
          status: "success"
        };
      }),

      removeConversation: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { _id } = input;
        const { models } = ctx;
        await models.ConversationMessages.deleteMany({ conversationId: _id });
        return models.Conversations.deleteOne({ _id });
      }),

      updateUserChannels: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { channelIds, userId } = input;
        const { models } = ctx;

        return {
          status: "success",
          data: await models.Channels.updateUserChannels(channelIds, userId)
        };
      }),

      getIntegrationKinds: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {

          return {
          status: "success",
          data: await getIntegrationsKinds()
        };
      }),

    getConversationsList: t.procedure
      .input(z.any())
      .query(async ({ ctx, input }) => {
        const { query, listParams } = input;
        const { models } = ctx;

        return {
          status: 'success',
          // data: await cursorPaginate<IConversationDocument>({
          //   model: models.Conversations,
          //   params: listParams,
          //   query: query,
          // }),
        };
      }),
      getModuleRelation: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
      const { module, target } = input;

      let filter;
      if (module.includes("contacts")) {
        const queryField =
          target[module.includes("company") ? "companyId" : "customerId"];

        if (queryField) {
          filter = {
            _id: queryField
          };
        }
      }

      return {
        status: "success",
        data: filter
      };
      }),

      sendNotifications: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
         const { subdomain } = ctx;
         await sendNotifications(subdomain, input);
      }),

      conversationClientMessageInserted: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
         const { subdomain ,models} = ctx;

         await pConversationClientMessageInserted(models, subdomain, input)
      }),

      widgetsGetUnreadMessagesCount: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { conversationId } = input;
        const { models} = ctx;
        return {
        status: "success",
        data: await models.ConversationMessages.widgetsGetUnreadMessagesCount(
          conversationId
        )
        };
      }),
  }),
});
