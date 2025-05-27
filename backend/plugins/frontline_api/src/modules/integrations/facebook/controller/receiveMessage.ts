import { IModels } from '~/connectionResolvers';
import { IFacebookIntegrationDocument } from '@/integrations/facebook/@types/integrations';
import { INTEGRATION_KINDS } from '@/integrations/facebook/constants';
import {getOrCreateCustomer} from '@/integrations/facebook/controller/store'
import {receiveTrpcMessage} from '@/inbox/receiveMessage'
import { debugFacebook } from '@/integrations/facebook/debuggers';
import {Activity} from '@/integrations/facebook/@types/utils'
import {pConversationClientMessageInserted} from '@/inbox/graphql/resolvers/mutations/widget'
import graphqlPubsub  from 'erxes-api-shared/utils/graphqlPubSub'

export const receiveMessage = async (
  models: IModels,
  subdomain: string,
  integration: IFacebookIntegrationDocument,
  activity: Activity
) => {
 try {
    debugFacebook(`Received message: ${activity.text} from ${activity.from.id}`);
    const { recipient, from, timestamp, text, channelData } = activity;
    const pageId = recipient.id, 
    userId = from.id, 
    kind = INTEGRATION_KINDS.MESSENGER, 
    mid = channelData.message?.mid,
    attachments= channelData.message?.attachments

    const customer = await getOrCreateCustomer(
        models,
        subdomain,
        pageId,
        userId,
        kind
      );
      if(!customer){
        throw new Error('Customer not found')
      }

    let conversation = await models.FacebookConversations.findOne({
      senderId: userId,
      recipientId: pageId
    });

  // create conversation
  if (!conversation) {
    // save on integrations db
    try {
      conversation = await models.FacebookConversations.create({
        timestamp,
        senderId: userId,
        recipientId: pageId,
        content: text,
        integrationId: integration._id,
      });
    } catch (e) {
      throw new Error(
        e.message.includes("duplicate")
          ? "Concurrent request: conversation duplication"
          : e
      );
    }
  }
  const formattedAttachments = (attachments || [])
    .filter((att) => att.type !== "fallback")
    .map((att) => ({
      type: att.type,
      url: att.payload ? att.payload.url : ""
    }));

  // save on api
  try {
    const data = {
      action: 'create-or-update-conversation',
      payload: JSON.stringify({
        customerId: customer.erxesApiId,
        integrationId: integration.erxesApiId,
        content: text || "",
        attachments: formattedAttachments,
        conversationId: conversation.erxesApiId,
         updatedAt: timestamp
      })
    };

    const apiConversationResponse = await receiveTrpcMessage(subdomain, data);

    if (apiConversationResponse.status === 'success') {
      conversation.erxesApiId = apiConversationResponse.data._id;
      await conversation.save();
    } else {
      throw new Error(`Conversation creation failed: ${JSON.stringify(apiConversationResponse)}`);
    }
  } catch (e) {
    await models.FacebookConversations.deleteOne({ _id: conversation._id });
    throw new Error(e);
  }
  // get conversation message
    let conversationMessage = await models.FacebookConversationMessages.findOne({
      mid: mid,
    });
    if (!conversationMessage) {
    try {
      const created = await models.FacebookConversationMessages.create({
        conversationId: conversation._id,
        mid: mid,
        createdAt: timestamp,
        content: text,
        customerId: customer.erxesApiId,
        attachments: formattedAttachments,
      });

      const doc = {
      ...created.toObject(),
      conversationId: conversation.erxesApiId
    };

     await pConversationClientMessageInserted(models,subdomain, doc);
  
    const publish = graphqlPubsub.publish as <T>(trigger: string, payload: T) => Promise<void>;

      await publish(`conversationClientMessageInserted:${conversation.erxesApiId}`, {
        conversationClientMessageInserted: {
          ...created.toObject(),
          conversationId: conversation.erxesApiId,
        },
      });

      conversationMessage = created;

    } catch (e) {
      throw new Error(
        e.message.includes("duplicate")
          ? "Concurrent request: conversation message duplication"
          : e
      );
    }
  }    
  } catch (error) {
   throw new Error(`Error processing Facebook message: ${error.message}.`);
  }
};