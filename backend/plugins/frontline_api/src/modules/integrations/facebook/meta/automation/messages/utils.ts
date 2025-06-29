import { getEnv } from 'erxes-api-shared/utils';
import moment from 'moment';
import { IModels } from '~/connectionResolvers';
import { pConversationClientMessageInserted } from '@/inbox/graphql/resolvers/mutations/widget';
import { receiveInboxMessage } from '@/inbox/receiveMessage';
import { IFacebookConversation } from '@/integrations/facebook/@types/conversations';
import { IFacebookCustomer } from '@/integrations/facebook/@types/customers';
import { IFacebookBotDocument } from '@/integrations/facebook/db/definitions/bots';
import { debugError } from '@/integrations/facebook/debuggers';
import { ISendMessageData } from '@/integrations/facebook/meta/automation/types/automationTypes';
import {
  generateBotData,
  generatePayloadString,
  getUrl,
} from '@/integrations/facebook/meta/automation/utils/messageUtils';
import { sendReply } from '@/integrations/facebook/utils';

export const generateMessages = async (
  subdomain: string,
  config: any,
  conversation: IFacebookConversation,
  customer: IFacebookCustomer,
  executionId: string,
) => {
  let { messages = [] } = config || {};

  const generateButtons = (buttons: any[] = []) => {
    const generatedButtons: any = [];

    for (const button of buttons) {
      const obj: any = {
        type: 'postback',
        title: (button.text || '').trim(),
        payload: generatePayloadString(
          conversation,
          button,
          customer?.erxesApiId || '',
          executionId,
        ),
      };

      if (button.link) {
        delete obj.payload;
        obj.type = 'web_url';
        obj.url = button.link;
      }

      generatedButtons.push(obj);
    }

    return generatedButtons;
  };

  const quickRepliesIndex = messages.findIndex(
    ({ type }) => type === 'quickReplies',
  );

  if (quickRepliesIndex !== -1) {
    const quickRepliesMessage = messages.splice(quickRepliesIndex, 1)[0];
    messages.push(quickRepliesMessage);
  }
  const generatedMessages: any[] = [];

  for (const {
    type,
    buttons,
    text,
    cards = [],
    quickReplies,
    image = '',
    video = '',
    audio = '',
    input,
  } of messages) {
    const botData = generateBotData(subdomain, {
      type,
      buttons,
      text,
      cards,
      quickReplies,
      image,
    });

    if (['text', 'input'].includes(type) && !buttons?.length) {
      generatedMessages.push({
        text: input ? input.text : text,
        botData,
        inputData: input,
      });
    }

    if (['text', 'input'].includes(type) && !!buttons?.length) {
      generatedMessages.push({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: (input ? input.text : text || '').trim(),
            buttons: generateButtons(buttons),
          },
        },
        botData,
        inputData: input,
      });
    }

    if (type === 'card' && cards?.length > 0) {
      generatedMessages.push({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: cards.map(
              ({ title = '', subtitle = '', image = '', buttons = [] }) => ({
                title,
                subtitle,
                image_url: getUrl(subdomain, image),
                buttons: generateButtons(buttons),
              }),
            ),
          },
        },
        botData,
      });
    }

    if (type === 'quickReplies') {
      generatedMessages.push({
        text: text || '',
        quick_replies: quickReplies.map((quickReply) => ({
          content_type: 'text',
          title: quickReply?.text || '',
          image_url: quickReply?.image_url
            ? getUrl(subdomain, quickReply?.image_url)
            : '',
          payload: generatePayloadString(
            conversation,
            quickReply,
            customer?.erxesApiId || '',
            executionId,
          ),
        })),
        botData,
      });
    }

    if (['image', 'audio', 'video'].includes(type)) {
      const url = image || video || audio;

      url &&
        generatedMessages.push({
          attachment: {
            type,
            payload: {
              url: getUrl(subdomain, url),
            },
          },
          botData,
        });
    }
  }

  return generatedMessages;
};
export const generateObjectToWait = ({
  messages = [],
  optionalConnects = [],
  conversation,
  customer,
}: {
  messages: any[];
  optionalConnects: any[];
  conversation: { _id: string } & IFacebookConversation;
  customer: IFacebookCustomer;
}) => {
  const obj: any = {};
  const general: any = {
    conversationId: conversation._id,
    customerId: customer.erxesApiId,
  };
  let propertyName = 'payload.btnId';

  if (messages.some((msg) => msg.type === 'input')) {
    const inputMessageConfig =
      messages.find((msg) => msg.type === 'input')?.input || {};

    if (inputMessageConfig.timeType === 'day') {
      obj.startWaitingDate = moment()
        .add(inputMessageConfig.value || 0, 'day')
        .toDate();
    }

    if (inputMessageConfig.timeType === 'hour') {
      obj.startWaitingDate = moment()
        .add(inputMessageConfig.value || 0, 'hour')
        .toDate();
    }
    if (inputMessageConfig.timeType === 'minute') {
      obj.startWaitingDate = moment()
        .add(inputMessageConfig.value || 0, 'minute')
        .toDate();
    }

    const actionIdIfNotReply =
      optionalConnects.find(
        (connect) => connect?.optionalConnectId === 'ifNotReply',
      )?.actionId || null;

    obj.waitingActionId = actionIdIfNotReply;

    propertyName = 'botId';
  } else {
    obj.startWaitingDate = moment().add(24, 'hours').toDate();
    obj.waitingActionId = null;
  }

  return {
    ...obj,
    objToCheck: {
      propertyName,
      general,
    },
  };
};

export const sendMessage = async (
  models,
  bot: IFacebookBotDocument,
  { senderId, recipientId, integration, message, tag }: ISendMessageData,
  isLoop?: boolean,
) => {
  try {
    // Try sending 'typing_on' but ignore if it fails
    try {
      await sendReply(
        models,
        'me/messages',
        {
          recipient: { id: senderId },
          sender_action: 'typing_on',
          tag,
        },
        recipientId,
        integration.erxesApiId,
      );
    } catch (typingError) {
      console.warn(`typing_on failed: ${typingError.message}`);
    }

    // Send the actual message
    const resp = await sendReply(
      models,
      'me/messages',
      {
        recipient: { id: senderId },
        message,
        tag,
      },
      recipientId,
      integration.erxesApiId,
    );

    return resp;
  } catch (error) {
    if (
      error.message.includes(
        'This message is sent outside of allowed window',
      ) &&
      bot?.tag &&
      !isLoop
    ) {
      await sendMessage(
        models,
        bot,
        {
          senderId,
          recipientId,
          integration,
          message,
          tag: bot?.tag,
        },
        true,
      );
    }

    debugError(`Error occurred during send bot message: ${error.message}`);
    throw new Error(error.message);
  }
};

export const getData = async (
  models: IModels,
  subdomain: string,
  triggerType: string,
  target: any,
  config: any,
): Promise<{
  conversation: any;
  integration: any;
  customer: any;
  bot: any;
  recipientId: string;
  senderId: string;
  botId: string;
}> => {
  if (triggerType === 'facebook:comments') {
    const { senderId, recipientId, erxesApiId } = target;

    const { botId } = config;

    let conversation = await models.FacebookConversations.findOne({
      senderId,
      recipientId,
    });

    const customer = await models.FacebookCustomers.findOne({
      erxesApiId: target.customerId,
    });

    if (!customer) {
      throw new Error(
        `Error occurred during send message with trigger type ${triggerType}`,
      );
    }
    const integration = await models.FacebookIntegrations.findOne({
      erxesApiId: customer?.integrationId,
    });

    if (!integration) {
      throw new Error(
        `Error occurred during send message with trigger type ${triggerType}`,
      );
    }

    const bot = await models.FacebookBots.findOne({ _id: botId });

    if (!bot) {
      throw new Error('Bot not found');
    }

    const DOMAIN = getEnv({
      name: 'DOMAIN',
      subdomain,
    });

    const timestamp = new Date();
    if (!conversation) {
      try {
        conversation = await models.FacebookConversations.create({
          timestamp,
          senderId,
          recipientId,
          content: 'Start conversation from comment',
          integrationId: integration._id,
          isBot: true,
          botId,
        });
      } catch (e) {
        throw new Error(
          e.message.includes('duplicate')
            ? 'Concurrent request: conversation duplication'
            : e,
        );
      }
    }

    // save on api
    try {
      const apiConversationResponse = await receiveInboxMessage(subdomain, {
        action: 'create-or-update-conversation',
        payload: JSON.stringify({
          customerId: customer.erxesApiId,
          integrationId: integration.erxesApiId,
          content: 'Start conversation from comment',
          conversationId: conversation.erxesApiId,
          updatedAt: timestamp,
        }),
      });

      if (apiConversationResponse.status === 'success') {
        conversation.erxesApiId = apiConversationResponse.data._id;

        await conversation.save();
      } else {
        throw new Error(
          `Conversation creation failed: ${JSON.stringify(
            apiConversationResponse,
          )}`,
        );
      }
    } catch (e) {
      await models.Conversations.deleteOne({ _id: conversation._id });
      throw new Error(e);
    }

    const created = await models.ConversationMessages.addMessage({
      conversationId: conversation._id,
      content: '<p>Bot Message</p>',
      internal: true,
      botId,
      botData: [
        {
          type: 'text',
          text: `${DOMAIN}/inbox/index?_id=${erxesApiId}`,
        },
      ],
      fromBot: true,
    });

    pConversationClientMessageInserted(subdomain, {
      ...created.toObject(),
      conversationId: conversation.erxesApiId,
    });

    return {
      conversation,
      integration,
      customer,
      bot,
      recipientId,
      senderId,
      botId,
    };
  }

  const conversation = await models.FacebookConversations.findOne({
    _id: target?.conversationId,
  });

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  const integration = await models.FacebookIntegrations.findOne({
    _id: conversation.integrationId,
  });

  if (!integration) {
    throw new Error('Integration not found');
  }
  const { recipientId, senderId, botId = '' } = conversation;

  const customer = await models.FacebookCustomers.findOne({
    userId: senderId,
  }).lean();

  if (!customer) {
    throw new Error(`Customer not found`);
  }

  const bot = await models.FacebookBots.findOne(
    { _id: botId },
    { tag: 1 },
  ).lean();

  if (!bot) {
    throw new Error(`Bot not found`);
  }

  return {
    conversation,
    integration,
    customer,
    bot,
    recipientId,
    senderId,
    botId,
  };
};
