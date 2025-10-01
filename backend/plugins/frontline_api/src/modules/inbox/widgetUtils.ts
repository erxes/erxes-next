import { IBrowserInfo } from 'erxes-api-shared/core-types';
import {
  client,
  getIndexPrefix,
  sendTRPCMessage,
} from 'erxes-api-shared/utils';
import { IModels } from '~/connectionResolvers';
import { debugError, debugInfo } from '~/modules/inbox/utils';

export const getOrCreateEngageMessage = async (
  models: IModels,
  subdomain: string,
  integrationId: string,
  browserInfo: IBrowserInfo,
  visitorId?: string,
  customerId?: string,
) => {
  let customer;

  if (customerId) {
    customer = await sendTRPCMessage({
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
  }

  if (!customer && !visitorId) {
    return null;
  }

  const integration = await models.Integrations.getIntegration({
    _id: integrationId,
    kind: 'messenger',
  });

  //   const brand = await sendTRPCMessage({
  //     pluginName: 'core',
  //     method: 'query',
  //     module: 'brands',
  //     action: 'findOne',
  //     input: {
  //       query: {
  //         _id: integration.brandId,
  //       },
  //     },
  //   });

  //   // try to create engage chat auto messages
  //   await sendEngagesMessage({
  //     subdomain,
  //     action: 'createVisitorOrCustomerMessages',
  //     data: {
  //       brandId: brand._id,
  //       integrationId: integration._id,
  //       customer,
  //       visitorId,
  //       browserInfo,
  //     },
  //     isRPC: true,
  //   });

  // find conversations
  const query = customerId
    ? { integrationId, customerId }
    : { integrationId, visitorId };

  const convs = await models.Conversations.find(query);

  return await models.ConversationMessages.findOne(
    await models.Conversations.widgetsUnreadMessagesQuery(convs),
  );
};

export const receiveVisitorDetail = async (subdomain: string, visitor) => {
  const { visitorId } = visitor;

  delete visitor.visitorId;
  delete visitor._id;

  const customer = await sendTRPCMessage({
    pluginName: 'core',
    method: 'mutation',
    module: 'customers',
    action: 'updateOne',
    input: {
      selector: { visitorId },
      modifier: { $set: visitor },
    },
  });

  const index = `${getIndexPrefix()}events`;

  try {
    const response = await client.updateByQuery({
      index,
      body: {
        script: {
          lang: 'painless',
          source:
            'ctx._source.visitorId = null; ctx._source.customerId = params.customerId',
          params: {
            customerId: customer._id,
          },
        },
        query: {
          term: {
            visitorId,
          },
        },
      },
    });

    debugInfo(`Response ${JSON.stringify(response)}`);
  } catch (e) {
    debugError(`Update event error ${e.message}`);
  }

  //   await sendCoreMessage({
  //     subdomain,
  //     action: 'visitor.removeEntry',
  //     data: {
  //       visitorId,
  //     },
  //   });

  return customer;
};
