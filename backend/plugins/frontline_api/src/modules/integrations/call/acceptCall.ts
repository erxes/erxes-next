import { IModels } from '~/connectionResolvers';
import { getOrCreateCustomer } from './store';
import { findIntegration } from './utils';
import { receiveInboxMessage } from '~/modules/inbox/receiveMessage';
import { graphqlPubsub } from 'erxes-api-shared/utils';

const acceptCall = async (
  models: IModels,
  subdomain: string,
  params,
  user,
  type?: string,
) => {
  const integration = await findIntegration(subdomain, params);

  const operator = integration.operators?.find(
    (operator) => operator.userId === user?._id,
  );
  params.operatorPhone = integration.phone;
  params.extentionNumber = operator?.gsUsername || '';
  const {
    extentionNumber,
    operatorPhone,
    customerPhone,
    callStartTime,
    callType,
    callStatus,
    timeStamp,
    queueName,
  } = params;

  let queue = queueName as any;
  if (queueName === '') {
    queue = null; // or set a default value
  }

  let customer = await models.CallCustomers.findOne({
    primaryPhone: customerPhone,
  });

  let history;
  try {
    const historyData: any = {
      operatorPhone,
      customerPhone,
      callStartTime,
      callType,
      callStatus,
      inboxIntegrationId: integration.inboxId,
      createdAt: new Date(),
      createdBy: user._id,
      updatedBy: user._id,
      callDuration: 0,
      extentionNumber,
      queueName: queue,
      timeStamp,
    };

    if (timeStamp === 0) {
      historyData.timeStamp = Date.now().toString();
    }

    history = new models.CallHistory(historyData);

    try {
      await models.CallHistory.deleteMany({
        timeStamp,
        callStatus: { $eq: 'cancelled' },
      });

      await history?.save();
    } catch (error) {
      await models.CallHistory.deleteOne({ _id: history?._id });
      console.error('Error saving call history:', error.message);
    }
  } catch (e) {
    throw new Error(
      e.message.includes('duplicate')
        ? 'Concurrent request: call history duplication'
        : e.message,
    );
  }
  if (!customer || !customer.erxesApiId) {
    customer = await getOrCreateCustomer(models, subdomain, {
      inboxIntegrationId: integration.inboxId,
      primaryPhone: params.customerPhone,
    });
  }

  try {
    const data = {
      action: 'create-or-update-conversation',
      payload: JSON.stringify({
        customerId: customer?.erxesApiId,
        integrationId: integration.inboxId,
        content: params.callType || '',
        conversationId: history.conversationId,
        updatedAt: new Date(),
        owner: type === 'addHistory' ? user?.details?.operatorPhone : '',
      }),
    };

    const apiConversationResponse = await receiveInboxMessage(subdomain, data);

    if (apiConversationResponse.status === 'success') {
      history.erxesApiId = apiConversationResponse.data._id;

      await history.save();
    } else {
      throw new Error(
        `Conversation creation failed: ${JSON.stringify(
          apiConversationResponse,
        )}`,
      );
    }
  } catch (e) {
    await models.CallHistory.deleteCallHistory(history._id, user);
    throw new Error(e);
  }

  await graphqlPubsub.publish(
    `conversationMessageInserted:${history.conversationId}`,
    {
      conversationMessageInserted: {
        ...history.toObject(),
        conversationId: history.conversationId,
      },
    },
  );

  return history;
};

export default acceptCall;
