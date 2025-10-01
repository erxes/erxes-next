import {
  getEnv,
  graphqlPubsub,
  isEnabled,
  redis,
  sendTRPCMessage,
} from 'erxes-api-shared/utils';
import { IModels, generateModels } from '~/connectionResolvers';
import {
  IIntegrationDocument,
  IMessengerDataMessagesItem,
} from '~/modules/inbox/@types/integrations';
import { IAttachment } from '~/modules/inbox/db/definitions/integrations';
import { IContext } from '~/connectionResolvers';
import { IconLetterB } from '@tabler/icons-react';
import {
  AUTO_BOT_MESSAGES,
  CONVERSATION_OPERATOR_STATUS,
  CONVERSATION_STATUSES,
  MESSAGE_TYPES,
} from '~/modules/inbox/db/definitions/constants';
import { debugError } from '~/modules/inbox/utils';
import * as strip from 'strip';
import { IBrowserInfo } from 'erxes-api-shared/core-types';
import { trackViewPageEvent } from '~/modules/inbox/events';
import { VERIFY_EMAIL_TRANSLATIONS } from '~/modules/inbox/constants';

export const pConversationClientMessageInserted = async (
  subdomain,
  message: { _id: string; [other: string]: any },
) => {
  const models = await generateModels(subdomain);

  const conversation = await models.Conversations.findOne(
    {
      _id: message.conversationId,
    },
    { integrationId: 1 },
  );
  if (!conversation) {
    console.warn(`Conversation not found for message: ${message._id}`);
    return;
  }
  const integration = await models.Integrations.findOne(
    {
      _id: conversation.integrationId,
    },
    { _id: 1, name: 1 },
  );

  let channelMemberIds: string[] = [];

  if (integration) {
    const channels = await models.Channels.find(
      {
        integrationIds: { $in: [integration._id] },
      },
      { _id: 1, memberIds: 1 },
    );

    for (const channel of channels) {
      channelMemberIds = [...channelMemberIds, ...(channel.memberIds || [])];
    }
  }
  if (!conversation) {
    console.warn(`Conversation not found for message: ${message._id}`);
    return;
  }
  await graphqlPubsub.publish(
    `conversationMessageInserted:${conversation._id}`,
    {
      conversationMessageInserted: message,
      subdomain,
      conversation,
      integration,
    },
  );

  for (const userId of channelMemberIds) {
    await graphqlPubsub.publish(
      `conversationClientMessageInserted:${subdomain}:${userId}`,
      {
        conversationClientMessageInserted: message,
        subdomain,
        conversation,
        integration,
      },
    );
  }
};

export const getMessengerData = async (
  models: IModels,
  integration: IIntegrationDocument,
  subdomain,
) => {
  let messagesByLanguage: IMessengerDataMessagesItem | null = null;
  let messengerData = integration.messengerData;

  if (messengerData) {
    if (messengerData.toJSON) {
      messengerData = messengerData.toJSON() as any;
    }

    const languageCode = integration.languageCode || 'en';
    const messages = (messengerData || {}).messages;

    if (messages) {
      messagesByLanguage = messages[languageCode];
    }

    if (
      messengerData &&
      messengerData.hideWhenOffline &&
      messengerData.availabilityMethod === 'auto'
    ) {
      const isOnline = await models.Integrations.isOnline(integration);
      if (!isOnline) {
        messengerData.showChat = false;
      }
    }
  }

  // knowledgebase app =======
  const kbApp: any = await models.MessengerApps.findOne({
    kind: 'knowledgebase',
    'credentials.integrationId': integration._id,
  });
  const topicId = kbApp && kbApp.credentials ? kbApp.credentials.topicId : null;

  // lead app ==========
  const leadApps: any[] = await models.MessengerApps.find({
    kind: 'lead',
    'credentials.integrationId': integration._id,
  });
  const formCodes = [] as string[];

  for (const app of leadApps) {
    if (app && app.credentials) {
      formCodes.push(app.credentials.formCode);
    }
  }

  // website app ============
  const websiteApps = await models.MessengerApps.find({
    kind: 'website',
    'credentials.integrationId': integration._id,
  });
  let getStartedCondition: { isSelected?: boolean } | false = false;
  const isServiceAvailable = await isEnabled('automations');

  if (isServiceAvailable) {
    const getStarted = await sendTRPCMessage({
      pluginName: 'core',
      module: 'automations',
      action: 'trigger.find',
      input: {
        query: {
          triggerType: 'inbox:messages',
          botId: integration._id,
        },
      },
    }).catch((error) => {
      throw error;
    });

    getStartedCondition = (
      getStarted[0]?.triggers[0]?.config?.conditions || []
    ).find((condition) => condition.type === 'getStarted');
  }

  return {
    ...(messengerData || {}),
    getStarted: getStartedCondition ? getStartedCondition.isSelected : false,
    messages: messagesByLanguage,
    knowledgeBaseTopicId: topicId,
    websiteApps,
    formCodes,
  };
};

const createVisitor = async (subdomain: string, visitorId: string) => {
  const customer = await sendTRPCMessage({
    pluginName: 'core',
    method: 'mutation',
    module: 'customers',
    action: 'createCustomer',
    input: {
      state: 'visitor',
      visitorId,
    },
  });
  await sendTRPCMessage({
    pluginName: 'core',
    method: 'mutation',
    module: 'customers',
    action: 'createCustomer',
    input: {
      state: 'visitor',
      visitorId,
    },
  });

  return customer;
};

export const widgetMutations = {
  async widgetTicketCreated(_root, doc, { subdomain }: IContext) {
    // return await sendTicketsMessage({
    //   subdomain,
    //   action: 'widgets.createTicket',
    //   data: {
    //     doc,
    //   },
    //   isRPC: true,
    // });
  },
  async widgetsTicketCustomersEdit(
    _root,
    args: {
      customerId?: string;
      firstName?: string;
      lastName?: string;
      emails?: string[];
      phones?: string[];
    },
    { models, subdomain }: IContext,
  ) {
    const { customerId, firstName, lastName, emails, phones } = args;
    if (!customerId) {
      throw new Error('Customer ID not found');
    }
    // return await sendCoreMessage({
    //   subdomain,
    //   action: 'customers.updateCustomer',
    //   data: {
    //     _id: customerId,
    //     doc: {
    //       firstName,
    //       lastName,
    //       emails: emails?.map((email) => ({ email, type: 'other' })),
    //       phones: phones?.map((phone) => ({ phone, type: 'other' })),
    //     },
    //   },
    //   isRPC: true,
    //   defaultValue: null,
    // });
  },
  async widgetsTicketCheckProgressForget(
    _root,
    args: {
      email?: string;
      phoneNumber?: string;
    },
    { subdomain }: IContext,
  ) {
    const { email, phoneNumber } = args;
    // return sendTicketsMessage({
    //   subdomain,
    //   action: 'widgets.fetchTicketProgressForget',
    //   data: {
    //     email,
    //     phoneNumber,
    //   },
    //   isRPC: true,
    // });
  },

  async widgetsTicketCommentAdd(
    _root,
    args: {
      type: string;
      typeId: string;
      content: string;
      userType: string;
      customerId: string;
    },
    { subdomain }: IContext,
  ) {
    const { type, typeId, content, userType, customerId } = args;
    // return await sendTicketsMessage({
    //   subdomain,
    //   action: 'widgets.commentAdd',
    //   data: {
    //     type,
    //     typeId,
    //     content,
    //     userType,
    //     customerId,
    //   },
    //   isRPC: true,
    // });
  },
  async widgetsTicketCommentsRemove(
    _root,
    args: {
      _id: string;
    },
    { subdomain }: IContext,
  ) {
    const { _id } = args;
    // await sendTicketsMessage({
    //   subdomain,
    //   action: 'widgets.comment.remove',
    //   data: {
    //     _id,
    //   },
    //   isRPC: true,
    // });
    return 'deleted';
  },

  async widgetsTicketCheckProgress(
    _root,
    args: {
      number?: string;
    },
    { models, subdomain }: IContext,
  ) {
    const { number } = args;
    // return sendTicketsMessage({
    //   subdomain,
    //   action: 'widgets.fetchTicketProgress',
    //   data: {
    //     number,
    //   },
    //   isRPC: true,
    // });
  },
  async widgetsLeadIncreaseViewCount(
    _root,
    { formId }: { formId: string },
    { models }: IContext,
  ) {
    return models.Integrations.increaseViewCount(formId);
  },

  /*
   * Create a new customer or update existing customer info
   * when connection established
   */
  async widgetsMessengerConnect(
    _root,
    args: {
      brandCode: string;
      email?: string;
      phone?: string;
      code?: string;
      isUser?: boolean;
      companyData?: any;
      data?: any;
      cachedCustomerId?: string;
      deviceToken?: string;
      visitorId?: string;
    },
    { models, subdomain, user }: IContext,
  ) {
    const {
      brandCode,
      email,
      phone,
      code,
      isUser,
      companyData,
      data,

      cachedCustomerId,
      deviceToken,
      visitorId,
    } = args;

    const customData = data;

    const brand = await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'brands',
      action: 'findOne',
      input: {
        query: {
          code: brandCode,
        },
      },
    });
    console.log(brand, 'brand');
    if (!brand) {
      throw new Error('Invalid configuration');
    }

    // find integration
    const integration = await models.Integrations.findOne({
      brandId: brand._id,
      kind: 'messenger',
    });

    if (!integration) {
      throw new Error('Integration not found');
    }
    console.log('1');
    let customer;

    if (cachedCustomerId || email || phone || code) {
      customer = await sendTRPCMessage({
        pluginName: 'core',
        method: 'query',
        module: 'customers',
        action: 'getWidgetCustomer',
        input: {
          query: {
            integrationId: integration._id,
            cachedCustomerId,
            email,
            phone,
            code,
          },
        },
        defaultValue: [],
      });

      let doc = {
        integrationId: integration._id,
        email,
        phone,
        code,
        isUser,
        deviceToken,
        scopeBrandIds: [brand._id],
      };
      console.log('111');

      customer = customer
        ? await sendTRPCMessage({
            pluginName: 'core',
            method: 'mutation',
            module: 'customers',
            action: 'updateMessengerCustomer',
            input: {
              query: {
                _id: customer._id,
                doc,
                customData,
              },
            },
          })
        : await sendTRPCMessage({
            pluginName: 'core',
            method: 'mutation',
            module: 'customers',
            action: 'createMessengerCustomer',
            input: {
              query: {
                doc,
                customData,
              },
            },
          });
      console.log('1221');
    }
    if (visitorId) {
      await sendTRPCMessage({
        pluginName: 'core',
        method: 'mutation',
        module: 'customers',
        action: 'createMessengerCustomer',
        input: {
          query: {
            customData,
          },
        },
      });

      // await sendCoreMessage({
      //   subdomain,
      //   action: 'visitor.createOrUpdate',
      //   data: {
      //     visitorId,
      //     integrationId: integration._id,
      //     scopeBrandIds: [brand._id],
      //   },
      // });
    }
    console.log('122121');
    // get or create company
    if (companyData && companyData.name) {
      let company = await sendTRPCMessage({
        pluginName: 'core',
        method: 'mutation',
        module: 'companies',
        action: 'findOne',
        input: {
          query: {
            companyData,
          },
        },
      });

      const { customFieldsData, trackedData } = await sendTRPCMessage({
        pluginName: 'core',
        method: 'query',
        module: 'fields',
        action: 'generateCustomFieldsData',
        input: {
          query: {
            customData: companyData,
            contentType: 'core:company',
          },
        },
      });

      companyData.customFieldsData = customFieldsData;
      companyData.trackedData = trackedData;

      if (!company) {
        companyData.primaryName = companyData.name;
        companyData.names = [companyData.name];

        company = await sendTRPCMessage({
          pluginName: 'core',
          method: 'query',
          module: 'companies',
          action: 'createCompany',
          input: {
            query: {
              ...companyData,
              scopeBrandIds: [brand._id],
            },
          },
        });
      } else {
        company = await sendTRPCMessage({
          pluginName: 'core',
          method: 'mutation',
          module: 'companies',
          action: 'updateCompany',
          input: {
            query: {
              _id: company._id,
              doc: companyData,
              scopeBrandIds: [brand._id],
            },
          },
        });

        // sendAutomationsMessage({
        //   subdomain,
        //   action: 'trigger',
        //   data: { type: 'core:company', targets: [company] },
        //   isRPC: true,
        //   defaultValue: null,
        // });
      }

      if (customer && company) {
        // add company to customer's companyIds list

        await sendTRPCMessage({
          pluginName: 'core',
          method: 'mutation',
          module: 'conformities',
          action: 'create',
          input: {
            mainType: 'customer',
            mainTypeId: customer._id,
            relType: 'company',
            relTypeId: company._id,
          },
        });
      }
    }

    if (!integration.isConnected) {
      await models.Integrations.updateOne(
        { _id: integration._id },
        { $set: { isConnected: true } },
      );

      // await sendCoreMessage({
      //   subdomain,
      //   action: 'registerOnboardHistory',
      //   data: {
      //     type: 'erxesMessagerConnect',
      //     user,
      //   },
      // });
    }
    console.log('12', integration);
    return {
      integrationId: integration._id,
      uiOptions: integration.uiOptions,
      languageCode: integration.languageCode,
      ticketData: integration.ticketData,
      messengerData: await getMessengerData(models, integration, subdomain),
      customerId: customer && customer._id,
      visitorId: customer ? null : visitorId,
      brand,
    };
  },
  /*
   * Create a new message
   */
  async widgetsInsertMessage(
    _root,
    args: {
      integrationId: string;
      customerId?: string;
      visitorId?: string;
      conversationId?: string;
      message: string;
      skillId?: string;
      attachments?: any[];
      contentType: string;
      payload: string;
    },
    { models, subdomain }: IContext,
  ) {
    const {
      integrationId,
      visitorId,
      conversationId,
      message,
      skillId,
      attachments,
      contentType,
      payload,
    } = args;

    if (contentType === MESSAGE_TYPES.VIDEO_CALL_REQUEST) {
      const videoCallRequestMessage = await models.ConversationMessages.findOne(
        { conversationId, contentType },
        { createdAt: 1 },
      ).sort({ createdAt: -1 });

      if (videoCallRequestMessage) {
        const messageTime = new Date(
          videoCallRequestMessage.createdAt,
        ).getTime();

        const nowTime = new Date().getTime();

        let integrationConfigs: Array<{ code: string; value?: string }> = [];

        try {
          integrationConfigs = await models.Configs.find({});
        } catch (e) {
          debugError(e);
        }

        const timeDelay = integrationConfigs.find(
          (config) => config.code === 'VIDEO_CALL_TIME_DELAY_BETWEEN_REQUESTS',
        ) || { value: '0' };

        const timeDelayIntValue = parseInt(timeDelay.value || '0', 10);

        const timeDelayValue = isNaN(timeDelayIntValue) ? 0 : timeDelayIntValue;

        if (messageTime + timeDelayValue * 1000 > nowTime) {
          const defaultValue = 'Video call request has already sent';

          const messageForDelay = integrationConfigs.find(
            (config) => config.code === 'VIDEO_CALL_MESSAGE_FOR_TIME_DELAY',
          ) || { value: defaultValue };

          throw new Error(messageForDelay.value || defaultValue);
        }
      }
    }

    const conversationContent = strip(message || '').substring(0, 100);

    let { customerId } = args;

    if (visitorId && !customerId) {
      const customer = await createVisitor(subdomain, visitorId);

      customerId = customer._id;
    }

    // customer can write a message
    // to the closed conversation even if it's closed
    let conversation;

    const integration =
      (await models.Integrations.findOne({ _id: integrationId })) ||
      ({} as any);
    const messengerData = integration.messengerData || {};
    const { botEndpointUrl, botShowInitialMessage, botCheck } = messengerData;
    let botId;
    if (botCheck === true) {
      botId = integration?._id;
    }
    const HAS_BOTENDPOINT_URL = (botEndpointUrl || '').length > 0;

    if (conversationId) {
      conversation = await models.Conversations.findOne({
        _id: conversationId,
      }).lean();
      conversation = await models.Conversations.findByIdAndUpdate(
        conversationId,
        {
          // mark this conversation as unread
          readUserIds: [],

          // reopen this conversation if it's closed
          status: CONVERSATION_STATUSES.OPEN,
        },
        { new: true },
      );
      // create conversation
    } else {
      conversation = await models.Conversations.createConversation({
        botId,
        isBot: !!botId,
        customerId,
        integrationId,
        operatorStatus: HAS_BOTENDPOINT_URL
          ? CONVERSATION_OPERATOR_STATUS.BOT
          : CONVERSATION_OPERATOR_STATUS.OPERATOR,
        status: CONVERSATION_STATUSES.OPEN,
        content: conversationContent,
        ...(skillId ? { skillId } : {}),
      });
    }

    // create message
    const msg = await models.ConversationMessages.createMessage({
      conversationId: conversation._id,
      customerId,
      attachments,
      contentType,
      content: message,
      botId: botId,
    });

    await models.Conversations.updateOne(
      { _id: msg.conversationId },
      {
        $set: {
          // Reopen its conversation if it's closed
          status: CONVERSATION_STATUSES.OPEN,

          // setting conversation's content to last message
          content: conversationContent,

          // Mark as unread
          readUserIds: [],

          customerId,

          // clear visitorId
          visitorId: '',
        },
      },
    );

    await sendTRPCMessage({
      pluginName: 'core',
      method: 'mutation',
      module: 'customers',
      action: 'markCustomerAsActive',
      input: {
        customerId: conversation.customerId,
      },
    });

    await pConversationClientMessageInserted(subdomain, msg);
    graphqlPubsub.publish(`conversationMessageInserted:${msg.conversationId}`, {
      conversationMessageInserted: msg,
    });
    // if (isEnabled('automations')) {
    //   await handleAutomation(subdomain, {
    //     conversationMessage: msg, // Pass msg as conversationMessage
    //     payload: payload,
    //   });
    // }

    // bot message ================
    if (
      HAS_BOTENDPOINT_URL &&
      !botShowInitialMessage &&
      conversation.operatorStatus === CONVERSATION_OPERATOR_STATUS.BOT
    ) {
      graphqlPubsub.publish(
        `conversationBotTypingStatus:${msg.conversationId}`,
        {
          conversationBotTypingStatus: {
            conversationId: msg.conversationId,
            typing: true,
          },
        },
      );

      try {
        const botRequest = await fetch(
          `${botEndpointUrl}/${conversation._id}`,
          {
            method: 'POST',
            body: JSON.stringify({
              type: 'text',
              text: message,
            }),
            headers: { 'Content-Type': 'application/json' },
          },
        ).then((r) => r.json());

        const { responses } = botRequest;

        const botData =
          responses.length !== 0
            ? responses
            : [
                {
                  type: 'text',
                  text: AUTO_BOT_MESSAGES.NO_RESPONSE,
                },
              ];

        const botMessage = await models.ConversationMessages.createMessage({
          conversationId: conversation._id,
          customerId,
          contentType,
          botData,
        });

        graphqlPubsub.publish(
          `conversationBotTypingStatus:${msg.conversationId}`,
          {
            conversationBotTypingStatus: {
              conversationId: msg.conversationId,
              typing: false,
            },
          },
        );

        graphqlPubsub.publish(
          `conversationMessageInserted:${botMessage.conversationId}`,
          {
            conversationMessageInserted: botMessage,
          },
        );
      } catch (e) {
        debugError(`Failed to connect to BOTPRESS: ${e.message}`);
      }
    }

    const customerLastStatus =
      (await redis.get(`customer_last_status_${customerId}`)) || 'left';

    if (customerLastStatus === 'left' && customerId) {
      await redis.set(`customer_last_status_${customerId}`, 'joined');

      // customer has joined + time
      const conversationMessages =
        await models.Conversations.changeCustomerStatus(
          'joined',
          customerId,
          conversation.integrationId,
        );

      for (const mg of conversationMessages) {
        graphqlPubsub.publish(
          `conversationMessageInserted:${mg.conversationId}`,
          {
            conversationMessageInserted: mg,
          },
        );
      }

      // notify as connected
      graphqlPubsub.publish(`customerConnectionChanged:${customerId}`, {
        customerConnectionChanged: {
          _id: customerId,
          status: 'connected',
        },
      });
    }

    // await sendToWebhook({
    //   subdomain,
    //   data: {
    //     action: 'create',
    //     type: 'inbox:customerMessages',
    //     params: msg,
    //   },
    // });

    return msg;
  },

  /*
   * Mark given conversation's messages as read
   */
  async widgetsReadConversationMessages(
    _root,
    args: { conversationId: string },
    { models }: IContext,
  ) {
    await models.ConversationMessages.updateMany(
      {
        conversationId: args.conversationId,
        userId: { $exists: true },
        isCustomerRead: { $ne: true },
      },
      { isCustomerRead: true },
      { multi: true },
    );

    return args.conversationId;
  },

  async widgetsSaveCustomerGetNotified(
    _root,
    args,
    { models, subdomain }: IContext,
  ) {
    const { visitorId, customerId } = args;

    if (visitorId && !customerId) {
      const customer = await createVisitor(subdomain, visitorId);
      args.customerId = customer._id;

      await models.ConversationMessages.updateVisitorEngageMessages(
        visitorId,
        customer._id,
      );
      await models.Conversations.updateMany(
        {
          visitorId,
        },
        { $set: { customerId: customer._id, visitorId: '' } },
      );
    }

    await sendTRPCMessage({
      pluginName: 'core',
      method: 'mutation',
      module: 'customers',
      action: 'saveVisitorContactInfo',
      input: {
        args,
      },
    });
  },

  /*
   * Update customer location field
   */
  async widgetsSaveBrowserInfo(
    _root,
    {
      visitorId,
      customerId,
      browserInfo,
    }: { visitorId?: string; customerId?: string; browserInfo: IBrowserInfo },
    { subdomain }: IContext,
  ) {
    // update location

    if (customerId) {
      await sendTRPCMessage({
        pluginName: 'core',
        method: 'mutation',
        module: 'customers',
        action: 'updateLocation',
        input: {
          customerId,
          browserInfo,
        },
      });

      await sendTRPCMessage({
        pluginName: 'core',
        method: 'mutation',
        module: 'customers',
        action: 'updateSession',
        input: {
          customerId,
        },
      });
    }

    if (visitorId) {
      await sendTRPCMessage({
        pluginName: 'core',
        method: 'mutation',
        module: 'customers',
        action: 'updateEntry',
        input: {
          visitorId,
          location: browserInfo,
        },
      });
    }

    try {
      await trackViewPageEvent(subdomain, {
        visitorId,
        customerId,
        attributes: { url: browserInfo.url },
      });
    } catch (e) {
      /* istanbul ignore next */
      debugError(
        `Error occurred during widgets save browser info ${e.message}`,
      );
    }

    return null;
  },

  async widgetsSendTypingInfo(
    _root,
    args: { conversationId: string; text?: string },
  ) {
    graphqlPubsub.publish(
      `conversationClientTypingStatusChanged:${args.conversationId}`,
      {
        conversationClientTypingStatusChanged: args,
      },
    );

    return 'ok';
  },

  async widgetsSendEmail(_root, args, { subdomain, models }: IContext) {
    const { toEmails, fromEmail, title, content, customerId, formId } = args;

    const attachments = args.attachments || [];

    // do not use Customers.getCustomer() because it throws error if not found

    const customer = await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'customers',
      action: 'findOne',
      input: {
        query: {
          _id: customerId,
        },
      },
    });

    const form = await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'forms',
      action: 'findOne',
      input: {
        query: {
          _id: formId,
        },
      },
    });

    let finalContent = content;

    if (customer && form) {
      // const replacedContent = await new EditorAttributeUtil(
      //   `${process.env.DOMAIN}/gateway/pl:core`,
      //   await getServices(),
      //   subdomain,
      // ).replaceAttributes({
      //   content,
      //   customer,
      //   user:
      //     (await sendCoreMessage({
      //       subdomain,
      //       action: 'users.findOne',
      //       data: {
      //         _id: form.createdUserId,
      //       },
      //       isRPC: true,
      //       defaultValue: {},
      //     })) || {},
      // });
      // finalContent = replacedContent || '';
    }

    let mailAttachment: any = [];

    if (attachments.length > 0) {
      mailAttachment = attachments.map((file) => {
        return {
          filename: file.name || '',
          path: file.url || '',
        };
      });
    }

    const { verifyEmail = false } = form.leadData || {};

    if (verifyEmail) {
      const domain = getEnv({ name: 'DOMAIN', subdomain })
        ? `${getEnv({ name: 'DOMAIN', subdomain })}/gateway`
        : 'http://localhost:4000';

      for (const email of toEmails) {
        const params = Buffer.from(
          JSON.stringify({
            email,
            formId,
            customerId,
          }),
        ).toString('base64');

        const emailValidationUrl = `${domain}/verify?p=${params}`;

        const languageCode = form.languageCode || 'en';
        const text =
          VERIFY_EMAIL_TRANSLATIONS[languageCode] ||
          VERIFY_EMAIL_TRANSLATIONS.en;

        finalContent += `\n<p><a href="${emailValidationUrl}" target="_blank">${text}</a></p>`;

        await sendTRPCMessage({
          pluginName: 'core',
          method: 'mutation',
          module: 'core',
          action: 'sendEmail',
          input: {
            toEmails: [email],
            fromEmail,
            title,
            template: { data: { content: finalContent } },
            attachments: mailAttachment,
          },
        });
      }

      return;
    }

    await sendTRPCMessage({
      pluginName: 'core',
      method: 'mutation',
      module: 'core',
      action: 'sendEmail',
      input: {
        toEmails,
        fromEmail,
        title,
        template: { data: { content: finalContent } },
        attachments: mailAttachment,
      },
    });
  },

  async widgetBotRequest(
    _root,
    {
      integrationId,
      conversationId,
      customerId,
      visitorId,
      message,
      payload,
      type,
    }: {
      conversationId?: string;
      customerId?: string;
      visitorId?: string;
      integrationId: string;
      message: string;
      payload: String;
      type: string;
    },
    { models, subdomain }: IContext,
  ) {
    const integration =
      (await models.Integrations.findOne({ _id: integrationId })) ||
      ({} as any);
    if (!integration) {
      throw new Error('Integration not found');
    }

    let msg;
    if (conversationId) {
      msg = await models.ConversationMessages.createMessage({
        conversationId,
        customerId,
        content: message,
        botId: integrationId,
      });
    } else {
      let conversation = await models.Conversations.createConversation({
        botId: integrationId,
        customerId,
        integrationId,
        status: CONVERSATION_STATUSES.OPEN,
        content: message,
      });
      msg = await models.ConversationMessages.createMessage({
        conversationId: conversation._id,
        customerId,
        content: message,
        botId: integrationId,
      });
    }
    graphqlPubsub.publish(`conversationMessageInserted:${msg.conversationId}`, {
      conversationMessageInserted: msg,
    });

    const key = type.includes('persistentMenu') ? 'persistentMenuId' : 'btnId';
    // if (isEnabled('automations')) {
    //   if (key) {
    //     await handleAutomation(subdomain, {
    //       conversationMessage: msg,
    //       payload: { [key]: payload, conversationId, customerId },
    //     });
    //   }
    // }

    return msg;
  },

  async widgetGetBotInitialMessage(
    _root,
    { integrationId }: { integrationId: string },
    { models }: IContext,
  ) {
    const sessionId = `_${Math.random().toString(36).substr(2, 9)}`;

    await redis.set(
      `bot_initial_message_session_id_${integrationId}`,
      sessionId,
    );

    const integration =
      (await models.Integrations.findOne({ _id: integrationId })) ||
      ({} as any);
    const { botEndpointUrl } = integration.messengerData;

    const botRequest = await fetch(`${botEndpointUrl}/${sessionId}`, {
      method: 'POST',
      body: JSON.stringify({
        type: 'text',
        text: 'getStarted',
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then((r) => r.json());

    await redis.set(
      `bot_initial_message_${integrationId}`,
      JSON.stringify(botRequest.responses),
    );

    return { botData: botRequest.responses };
  },
};
