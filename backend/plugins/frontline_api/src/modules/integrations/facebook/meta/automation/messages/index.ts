import {
  IAction,
  IAutomationExecutionDocument,
} from 'erxes-api-shared/core-modules';
import { sendWorkerQueue } from 'erxes-api-shared/utils';
import { IModels } from '~/connectionResolvers';
import { pConversationClientMessageInserted } from '@/inbox/graphql/resolvers/mutations/widget';
import { debugError } from '@/integrations/facebook/debuggers';
import { checkContentConditions } from '@/integrations/facebook/meta/automation/utils/messageUtils';
import {
  generateMessages,
  generateObjectToWait,
  getData,
  sendMessage,
} from './utils';

export const checkMessageTrigger = async (subdomain, { target, config }) => {
  const { conditions = [], botId } = config;

  if (target.botId !== botId) {
    return false;
  }

  const payload = target?.payload || {};
  const { persistentMenuId, isBackBtn } = payload;

  if (persistentMenuId && isBackBtn) {
    sendWorkerQueue('automations', 'playWait').add('playWait', {
      subdomain,
      data: {
        query: {
          triggerType: 'facebook:messages',
          'target.botId': botId,
          'target.conversationId': target.conversationId,
          'target.customerId': target.customerId,
        },
      },
    });

    return false;
  }

  for (const {
    isSelected,
    type,
    persistentMenuIds,
    conditions: directMessageCondtions = [],
  } of conditions) {
    if (isSelected) {
      if (type === 'getStarted' && target.content === 'Get Started') {
        return true;
      }

      if (type === 'persistentMenu' && payload) {
        if ((persistentMenuIds || []).includes(String(persistentMenuId))) {
          return true;
        }
      }

      if (type === 'direct') {
        if (directMessageCondtions?.length > 0) {
          return !!checkContentConditions(
            target?.content || '',
            directMessageCondtions,
          );
        } else if (!!target?.content) {
          return true;
        }
      }
    }
    continue;
  }
};

export const actionCreateMessage = async (
  models: IModels,
  subdomain: string,
  action: IAction,
  execution: IAutomationExecutionDocument,
) => {
  const {
    target,
    triggerType,
    triggerConfig,
    _id: executionId,
  } = execution || {};
  const { config } = action || {};

  if (
    !['facebook:messages', 'facebook:comments', 'facebook:ads'].includes(
      triggerType,
    )
  ) {
    throw new Error('Unsupported trigger type');
  }
  const {
    conversation,
    customer,
    integration,
    bot,
    senderId,
    recipientId,
    botId,
  } = await getData(models, subdomain, triggerType, target, triggerConfig);

  let result: any[] = [];

  try {
    const messages = await generateMessages(
      subdomain,
      config,
      conversation,
      customer,
      executionId,
    );

    if (!messages?.length) {
      return 'There are no generated messages to send.';
    }

    for (const { botData, inputData, ...message } of messages) {
      let resp;

      try {
        resp = await sendMessage(models, bot, {
          senderId,
          recipientId,
          integration,
          message,
        });
      } catch (error) {
        debugError(error.message);
        throw new Error(error.message);
      }

      if (!resp) {
        throw new Error('Something went wrong to send this message');
      }

      const conversationMessage =
        await models.FacebookConversationMessages.addMessage({
          conversationId: conversation._id,
          content: '<p>Bot Message</p>',
          internal: false,
          mid: resp.message_id,
          botId,
          botData,
          fromBot: true,
        });

      pConversationClientMessageInserted(subdomain, {
        ...conversationMessage,
        conversationId: conversation.erxesApiId,
      });

      result.push(conversationMessage);
    }

    const { optionalConnects = [] } = config;

    if (!optionalConnects?.length) {
      return result;
    }
    return {
      result,
      objToWait: generateObjectToWait({
        messages: config?.messages || [],
        conversation,
        customer,
        optionalConnects,
      }),
    };
  } catch (error) {
    debugError(error.message);
    throw new Error(error.message);
  }
};
