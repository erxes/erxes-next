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
import mongoose from 'mongoose';
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
  const message= await models.ConversationMessages.createMessage({
    engageData,
    formWidgetData,
    conversationId: conversation._id,
    userId,
    customerId,
    visitorId,
    content
  });
  return { conversation, message };
};
const t = initTRPC.context<ITRPCContext>().create();

export const inboxTrpcRouter = t.router({
  inbox: t.router({
    
     createConversationAndMessage: t.procedure
  .input(z.object({
    userId: z.string().min(1, "User ID is required"),
    status: z.string().optional().default('new'),
    customerId: z.string().optional(),
    visitorId: z.string().optional(),
    integrationId: z.string().min(1, "Integration ID is required"),
    content: z.string().min(1, "Message content cannot be empty"),
    engageData: z.record(z.unknown()).optional(),
    formWidgetData: z.record(z.unknown()).optional()
  }))
  .mutation(async ({ ctx, input }) => {
    const { models } = ctx;
    try {
      const {
        userId,
        status,
        customerId,
        visitorId,
        integrationId,
        content,
        engageData,
        formWidgetData
      } = input;

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

      return {
        status: 'success',
        data: response,
        timestamp: new Date().toISOString(),
        message: "Conversation created successfully"
      };
    } catch (error) {
      console.error('Create conversation error:', error);
      
      const errorDetails = error instanceof Error ? {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : {
        message: 'Unknown error occurred'
      };

      return {
        status: 'error',
        error: {
          code: 'CONVERSATION_CREATION_FAILED',
          ...errorDetails,
          suggestion: 'Please try again or contact support'
        },
        timestamp: new Date().toISOString()
      };
    }
  }),
  
   createOnlyMessage: t.procedure
  .input(z.object({
    conversationId: z.string().min(1, "Conversation ID is required"),
    content: z.string().min(1, "Message content cannot be empty"),
    userId: z.string().min(1, "User ID is required"),
    customerId: z.string().optional(),
    internal: z.boolean().default(false),
    contentType: z.string().default("text")
  }))
  .mutation(async ({ ctx, input }) => {
    const { models } = ctx;

    try {
      const message = await models.ConversationMessages.createMessage({
        conversationId: input.conversationId,
        content: input.content,
        userId: input.userId,
        customerId: input.customerId,
        internal: input.internal,
        contentType: input.contentType
      });

      return {
        success: true,
        data: message,
        timestamp: new Date().toISOString(),
        message: "Message created successfully"
      };
    } catch (error) {
      console.error('Message creation failed:', error);

      return {
        success: false,
        error: {
          code: 'MESSAGE_CREATION_FAILED',
          message: 'Failed to create message',
          details: error instanceof Error ? error.message : 'Unknown error',
          ...(process.env.NODE_ENV === 'development' && {
            debug: error instanceof Error ? error.stack : undefined
          })
        },
        timestamp: new Date().toISOString()
      };
    }
  }),

   integrationsNotification: t.procedure
  .input(z.any())
  .mutation(async ({ ctx, input }) => {
    const { subdomain } = ctx;

    try {
      const result = await receiveIntegrationsNotification(subdomain, input);

      return {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
        message: "Notification processed successfully"
      };
    } catch (error) {
      console.error('Integration notification failed:', error);

      return {
        success: false,
        error: {
          code: 'NOTIFICATION_PROCESSING_FAILED',
          message: 'Failed to process integration notification',
          details: error instanceof Error ? error.message : 'Unknown error',
          ...(process.env.NODE_ENV === 'development' && {
            debug: error instanceof Error ? error.stack : undefined
          })
        },
        timestamp: new Date().toISOString(),
        suggestion: 'Please verify the notification payload and try again'
      };
    }
  }),
  
    getConversations: t.procedure
      .input(z.any())
      .query(async ({ ctx, input }) => {
   
        const { query = {} } = input;
        const { models } = ctx;

        try {
          const conversations = await models.Conversations.find(query).lean();
          return {
            status: 'success',
            data: conversations,
          };
        } catch (error) {
          console.error('Error fetching conversations:', {
            error: error instanceof Error ? error.message : String(error),
            query,
          });
          return {
            status: 'error',
            message: 'Failed to fetch conversations',
            error: error instanceof Error ? error.message : String(error),
          };

        };
      }),
    removeCustomersConversations: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { customerIds } = input;
        const { models } = ctx;
        try {
          const result = await models.Conversations.removeCustomersConversations(customerIds);
          return {
            status: 'success',
            deletedCount: result.deletedCount || 0, 
          };
        } catch (error) {
          console.error('Error removing conversations:', {
            error: error instanceof Error ? error.message : String(error),
            customerIds,
          });
          return {
            status: 'error',
            message: 'Failed to remove conversations',
            error: error instanceof Error ? error.message : String(error),
          };
        }
      }),
    changeCustomer: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { customerId, customerIds } = input;
        const { models } = ctx;

        try {
          const result = await models.Conversations.changeCustomer(customerId, customerIds);
          return {
            status: 'success',
            modifiedCount: result.modifiedCount || 0, 
          };
        } catch (error) {
          console.error('Error changing customer for conversations:', {
            error: error instanceof Error ? error.message : String(error),
            customerId,
            customerIds,
          });
          return {
            status: 'error',
            message: 'Failed to change customer for conversations',
            error: error instanceof Error ? error.message : String(error),
          };
        }
      }),

    updateConversationMessage: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { filter, updateDoc } = input;
        const { models } = ctx;
        try {
          const updated = await models.ConversationMessages.updateOne(filter, {
            $set: updateDoc,
          });
          return {
            status: 'success',
            data: updated,
          };
        } catch (error) {
          console.error('Error updating conversation message:', {
            error: error instanceof Error ? error.message : String(error),
            filter,
            updateDoc,
          });
          return {
            status: 'error',
            message: 'Failed to update conversation message',
            error: error instanceof Error ? error.message : String(error),
          };
        }
      }),

 removeConversation: t.procedure
  .input(z.object({
    _id: z.string().min(1, "Conversation ID is required"),
    force: z.boolean().optional().default(false)
  }))
  .mutation(async ({ ctx, input }) => {
    const { models } = ctx;
    const { _id, force } = input;
    const session = await models.startSession();

    try {
      const transactionResult = await session.withTransaction(async () => {
        // Delete all related messages first
        const messagesResult = await models.ConversationMessages.deleteMany(
          { conversationId: _id },
          { session }
        );

        if (!force && messagesResult.deletedCount === 0) {
          console.warn(`No messages found for conversation ${_id}`);
        }

        // Then delete the conversation
        const conversationResult = await models.Conversations.deleteOne(
          { _id },
          { session }
        );

        if (!force && conversationResult.deletedCount === 0) {
          throw new Error(`Conversation ${_id} not found`);
        }

        return {
          conversationDeletedCount: conversationResult.deletedCount,
          messagesDeletedCount: messagesResult.deletedCount
        };
      });

      return {
        status: 'success',
        data: transactionResult,
        timestamp: new Date().toISOString(),
        message: `Deleted conversation and ${transactionResult.messagesDeletedCount} messages`
      };
    } catch (error) {
      await session.abortTransaction();
      console.error('Transaction failed:', {
        conversationId: _id,
        error: error instanceof Error ? error.stack : error
      });

      return {
        status: 'error',
        error: {
          code: 'DELETION_FAILED',
          message: 'Failed to delete conversation',
          details: error instanceof Error ? error.message : 'Database error',
          conversationId: _id,
          ...(process.env.NODE_ENV === 'development' && error instanceof Error ? { stack: error.stack } : {})
        },
        timestamp: new Date().toISOString()
      };
    } finally {
      await session.endSession();
    }
  }),
      updateUserChannels: t.procedure
      .input(z.object({
        channelIds: z.array(z.string()),
        userId: z.string()
      }))
      .mutation(async ({ ctx, input }) => {
        const { channelIds, userId } = input;
        const { models } = ctx;
        
        try {
          const result = await models.Channels.updateUserChannels(channelIds, userId);
          return {
            status: "success",
            data: result
          };
        } catch (error) {
          return {
            status: "error",
            message: "Failed to update user channels",
            error: error instanceof Error ? error.message : String(error)
          };
        }
      }),

      getIntegrationKinds: t.procedure
      .input(z.any())
      .query(async () => {
        try {
            const data = await getIntegrationsKinds();
            return {
              status: 'success',
              data,
            };
          } catch (error) {
            console.error('Error fetching integration kinds:', {
              error: error instanceof Error ? error.message : String(error),
            });
            return {
              status: 'error',
              message: 'Failed to fetch integration kinds',
              error: error instanceof Error ? error.message : String(error),
            };
          }
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
      .query(async ({input }) => {
      try {
      const { module, target } = input;
      let filter: { _id: string } | null = null;

      if (module.includes('contacts')) {
        const queryField = module.includes('company') ? target.companyId : target.customerId;

        if (!queryField) {
          return {
            status: 'error',
            message: `Missing ${module.includes('company') ? 'companyId' : 'customerId'} in target`,
          };
        }

        filter = { _id: queryField };
      }

      return {
        status: 'success',
        data: filter,
      };
    } catch (error) {
      console.error('Error generating module relation filter:', {
        error: error instanceof Error ? error.message : String(error),
        module,
      });
      return {
        status: 'error',
        message: 'Failed to generate module relation filter',
        error: error instanceof Error ? error.message : String(error),
      };
    }
 }),

   sendNotifications: t.procedure
    .input(z.any()) // Consider replacing with proper input validation
    .mutation(async ({ ctx, input }) => {
      const { subdomain } = ctx;
      try {
        await sendNotifications(subdomain, input);
        return { 
          status: 'success',
          message: 'Notifications sent successfully'
        };
      } catch (error) {
        return {
          status: 'error',
          message: 'Failed to send notifications',
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }),
      conversationClientMessageInserted: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
     const { subdomain ,models} = ctx;
      try {
      const result = await pConversationClientMessageInserted(models, subdomain, input);
      
      return {
        status: 'success',
        data: result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to insert client message:', error);
        return {
          status: 'error',
          message: 'Failed to process client message',
          error: error instanceof Error ? error.message : String(error)
        };
       }
      }),

      widgetsGetUnreadMessagesCount: t.procedure
      .input(z.any())
      .query(async ({ ctx, input }) => {
        const { conversationId } = input;
        const { models } = ctx;
       
      try {
      const unreadCount = await models.ConversationMessages.widgetsGetUnreadMessagesCount(
        conversationId,
      );

      return {
        success: true,
        data: {
          conversationId,
          unreadCount,
          lastChecked: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to get unread messages count:', {
        conversationId,
        error: error instanceof Error ? error.message : error
      });

      return {
        success: false,
        error: {
          code: 'UNREAD_COUNT_FAILED',
          message: 'Failed to retrieve unread messages count',
          details: error instanceof Error ? error.message : 'Database error',
          conversationId
        },
        timestamp: new Date().toISOString(),
        suggestion: 'Please try again or refresh the conversation'
      };
     }
      }),
  }),
});
