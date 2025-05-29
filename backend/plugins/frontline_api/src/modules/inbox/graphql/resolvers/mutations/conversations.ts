import * as _ from 'underscore';
import { IUserDocument } from 'erxes-api-shared/core-types';
import { IConversationDocument } from '@/inbox/@types/conversations';
import QueryBuilder, { IListArgs } from '~/conversationQueryBuilder';
import { CONVERSATION_STATUSES } from '@/inbox/db/definitions/constants';
import { generateModels, IContext, IModels } from '~/connectionResolvers';
import {IConversationMessageAdd} from '@/inbox/@types/conversationMessages'
import {IIntegrationDocument} from '@/inbox/@types/integrations'
import { AUTO_BOT_MESSAGES} from '@/inbox/db/definitions/constants'
import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { facebookIntegrations } from '@/integrations/facebook/messageBroker'
import graphqlPubsub  from 'erxes-api-shared/utils/graphqlPubSub'


/**
 * conversation notrification receiver ids
 */
export const sendConversationToServices = async (
  subdomain: string,
  integration: IIntegrationDocument,
  serviceName: string,
  payload: object
) => {
  try {
    const data = {
        action: `reply-${integration.kind.split("-")[1]}`,
        type: serviceName,
        payload: JSON.stringify(payload),
        integrationId: integration._id
    }
    switch (serviceName) {
      case 'facebook':
      return await facebookIntegrations({ subdomain, data }); 

      case 'instagram':
      
        break;

      case 'mobinetSms':
  
        break;

      default:
        throw new Error(`Unsupported service: ${serviceName}`);
    }
  } catch (e) {
    throw new Error(
      `Your message not sent. Error: ${e.message}. Go to integrations list and fix it.`
    );
  }
};


export const conversationNotifReceivers = (
  conversation: IConversationDocument,
  currentUserId: string,
  exclude = true,
): string[] => {
  let userIds: string[] = [];

  // assigned user can get notifications
  if (conversation.assignedUserId) {
    userIds.push(conversation.assignedUserId);
  }

  // participated users can get notifications
  if (
    conversation.participatedUserIds &&
    conversation.participatedUserIds.length > 0
  ) {
    userIds = _.union(userIds, conversation.participatedUserIds);
  }

  // exclude current user
  if (exclude) {
    userIds = _.without(userIds, currentUserId);
  }

  return userIds;
};

/**
 * Using this subscription to track conversation detail's assignee, tag, status
 * changes
 */
export const publishConversationsChanged = async (
  subdomain: string,
  _ids: string[],
  type: string,
): Promise<string[]> => {
  const models = await generateModels(subdomain);

  for (const _id of _ids) {
    (graphqlPubsub.publish as (trigger: string, payload: any) => Promise<void>)(
  `conversationChanged:${_id}`,
    {
      conversationChanged: { conversationId: _id, type },
    }
   );
    await models.Conversations.findOne({ _id });
  }

  return _ids;
};

/**
 * Publish admin's message
 */
export const publishMessage = async (
  models: IModels,
  message: any,
  customerId?: string,
) => {
  (graphqlPubsub.publish as (trigger: string, payload: any) => Promise<void>)(
      `conversationClientMessageInserted:${message.conversationId}`,
      {
        conversationClientMessageInserted: message,
      }
    );

    if (customerId) {
     const unreadCount =await models.ConversationMessages.widgetsGetUnreadMessagesCount(
        message.conversationId
      );

      (graphqlPubsub.publish as (trigger: string, payload: any) => Promise<void>)(
      `conversationAdminMessageInserted:${customerId}`,
      {
        conversationAdminMessageInserted: {
          customerId,
          unreadCount,
        },
      }
    );

   
  }
};

export const sendNotifications = async (
  subdomain: string,
  {
    user,
    conversations,
    type,
    mobile,
    messageContent,
  }: {
    user: IUserDocument;
    conversations: IConversationDocument[];
    type: string;
    mobile?: boolean;
    messageContent?: string;
  },
) => {

  for (const conversation of conversations) {
    if (!conversation || !conversation._id) {
      throw new Error('Error: Conversation or Conversation ID is undefined');
    }

    if (!user || !user._id) {
      throw new Error('Error: User or User ID is undefined');
    }

    const doc = {
      createdUser: user,
      link: `/inbox/index?_id=${conversation._id}`,
      title: 'Conversation updated',
      content: messageContent
        ? messageContent
        : conversation.content || 'Conversation updated',
      notifType: type,
      receivers: conversationNotifReceivers(conversation, user._id),
      action: 'updated conversation',
      contentType: 'conversation',
      contentTypeId: conversation._id,
    };

    switch (type) {
      case 'conversationAddMessage':
        doc.action = `sent you a message`;
        doc.receivers = conversationNotifReceivers(conversation, user._id);
        break;
      case 'conversationAssigneeChange':
        doc.action = 'has assigned you to conversation ';
        break;
      case 'unassign':
        doc.notifType = 'conversationAssigneeChange';
        doc.action = 'has removed you from conversation';
        break;
      case 'conversationStateChange':
        doc.action = `changed conversation status to ${(
          conversation.status || ''
        ).toUpperCase()}`;
        break;
      default:
        break;
    }
  }
};

const getConversationById = async (models: IModels, selector) => {
  const oldConversations = await models.Conversations.find(selector).lean();
  const oldConversationById = {};
  for (const conversation of oldConversations) {
    oldConversationById[conversation._id] = conversation;
  }
  return { oldConversationById, oldConversations };
};

export const conversationMutations = {
  /**
   * Create new message in conversation
   */
    async conversationMessageAdd(
    _root,
    doc: IConversationMessageAdd,
    { user, models, subdomain }: IContext
  ) {
    const conversation = await models.Conversations.getConversation(
      doc.conversationId
    );
    const integration = await models.Integrations.getIntegration({
      _id: conversation.integrationId
    });

    await sendNotifications(subdomain, {
      user,
      conversations: [conversation],
      type: "conversationAddMessage",
      mobile: true,
      messageContent: doc.content
    });

    const kind = integration.kind;

     const customer  =await sendTRPCMessage({
        pluginName: 'core',
        method: 'query',
        module: 'customers',
        action: 'findOne',
        input: { _id: conversation.customerId },
      });

    // if conversation's integration kind is form then send reply to
    // customer's email
    const email = customer ? customer.primaryEmail : "";

    if (!doc.internal && kind === "lead" && email) {
 
     await sendTRPCMessage({
        pluginName: 'core',
        method: 'mutation',
        module: 'core',
        action: 'sendEmail',
        input: { 
          toEmails: [email],
          title: "Reply",
          template: {
          data: doc.content
          }
        },
      });
    }

    const serviceName = integration.kind.split("-")[0];

 
      const payload = {
        integrationId: integration._id,
        conversationId: conversation._id,
        content: doc.content || "",
        internal: doc.internal,
        attachments: doc.attachments || [],
        extraInfo: doc.extraInfo,
        userId: user._id
      };

      const response = await sendConversationToServices(
        subdomain,
        integration,
        serviceName,
        payload
      );

      // if the service runs separately & returns data, then don't save message inside inbox
      if (response && response.data) {
        const { conversationId, content } = response.data;

        if (!!conversationId && !!content) {
          await models.Conversations.updateConversation(conversationId, {
            content: content || "",
            updatedAt: new Date()
          });
        }
        return { ...response.data };
      }
  

    // do not send internal message to third service integrations
    if (doc.internal) {
      const messageObj = await models.ConversationMessages.addMessage(
        doc,
        user._id
      );

      // publish new message to conversation detail
      publishMessage(models, messageObj);

      return messageObj;
    }

    const message = await models.ConversationMessages.addMessage(doc, user._id);

    const dbMessage = await models.ConversationMessages.getMessage(message._id);

  

    // Publishing both admin & client
    publishMessage(models, dbMessage, conversation.customerId);

    return dbMessage;
  },

  async conversationMessageEdit(
    _root,
    { _id, ...fields }: any,
    { user, models, }: IContext,
  ) {
    const message = await models.ConversationMessages.getMessage(_id);
    if (message.internal && user._id === message.userId) {
      return await models.ConversationMessages.updateMessage(
        _id,
        fields
      );
    }
   throw new Error(`You cannot edit this message. Only the author of an internal message can edit it.`);
  },

  /**
   * Assign employee to conversation
   */
  async conversationsAssign(
    _root,
    {
      conversationIds,
      assignedUserId,
    }: { conversationIds: string[]; assignedUserId: string },
    { user, models, subdomain }: IContext,
  ) {
 
    const conversations: IConversationDocument[] =
      await models.Conversations.assignUserConversation(
        conversationIds,
        assignedUserId
      );

    // notify graphl subscription
    publishConversationsChanged(subdomain, conversationIds, "assigneeChanged");

    await sendNotifications(subdomain, {
      user,
      conversations,
      type: "conversationAssigneeChange"
    });

    return conversations;
  },

  /**
   * Unassign employee from conversation
   */
  async conversationsUnassign(
    _root,
    { _ids }: { _ids: string[] },
    { user, models, subdomain }: IContext,
  ) {
   const { oldConversations } = await getConversationById(
      models,
      { _id: { $in: _ids } }
    );
    const updatedConversations =
      await models.Conversations.unassignUserConversation(_ids);

    await sendNotifications(subdomain, {
      user,
      conversations: oldConversations,
      type: "unassign"
    });

    // notify graphl subscription
    publishConversationsChanged(subdomain, _ids, "assigneeChanged");

  

    return updatedConversations;
  },

  /**
   * Change conversation status
   */
  async conversationsChangeStatus(
    _root,
    { _ids, status }: { _ids: string[]; status: string },
    { user, models, subdomain, serverTiming }: IContext,
  ) {
     serverTiming.startTime("changeStatus");

    await models.Conversations.changeStatusConversation(_ids, status, user._id);

    serverTiming.endTime("changeStatus");

    serverTiming.startTime("sendNotifications");

    // notify graphl subscription
    publishConversationsChanged(subdomain, _ids, status);

    const updatedConversations = await models.Conversations.find({
      _id: { $in: _ids }
    });

    await sendNotifications(subdomain, {
      user,
      conversations: updatedConversations,
      type: "conversationStateChange"
    });

    return updatedConversations;
  },

  /**
   * Resolve all conversations
   */
  async conversationResolveAll(
    _root,
    params: IListArgs,
    { user, models, subdomain }: IContext,
  ) {
    // initiate query builder
    const qb = new QueryBuilder(models, subdomain, params, { _id: user._id });

    await qb.buildAllQueries();
    const query = qb.mainQuery();

    const param = {
      status: CONVERSATION_STATUSES.CLOSED,
      closedUserId: user._id,
      closedAt: new Date()
    };

    const updated = await models.Conversations.resolveAllConversation(
      query,
      param
    );

    return updated.nModified || 0;
  },

  /**
   * Conversation mark as read
   */
  async conversationMarkAsRead(
    _root,
    { _id }: { _id: string },
    { user, models }: IContext,
  ) {
    return models.Conversations.markAsReadConversation(_id, user._id);
  },

  async changeConversationOperator(
    _root,
    { _id, operatorStatus }: { _id: string; operatorStatus: string },
    { models }: IContext,
  ) {
      const message =await models.ConversationMessages.createMessage({
        conversationId: _id,
        botData: [
          {
            type: "text",
            text: AUTO_BOT_MESSAGES.CHANGE_OPERATOR
          }
        ]
      });
      (graphqlPubsub.publish as (trigger: string, payload: any) => Promise<void>)(
        `conversationClientMessageInserted:${message.conversationId}`,
        {
          conversationClientMessageInserted: message,
        }
      );

      return models.Conversations.updateOne(
        { _id },
        { $set: { operatorStatus } }
      );
  },

  async conversationConvertToCard(
    _root,
    params: any,
    { user, models, }: IContext,
  ) {
    const { _id } = params;

    const conversation = await models.Conversations.getConversation(_id);

    const args = {
      ...params,
      conversation,
      user,
    };
    return args;
  },

  async conversationEditCustomFields(
    _root,
    { _id, customFieldsData }: { _id: string; customFieldsData: any },
    { models }: IContext,
  ) {
    await models.Conversations.updateConversation(_id, { customFieldsData });
    return models.Conversations.getConversation(_id);
  },
};
