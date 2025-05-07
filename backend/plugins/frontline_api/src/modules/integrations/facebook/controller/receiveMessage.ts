import { IModels } from '~/connectionResolvers';
import { IFacebookIntegrationDocument } from '@/integrations/facebook/@types/integrations';
import { Activity } from "botbuilder";
import {IChannelData} from '@/integrations/facebook/@types/utils'
import { INTEGRATION_KINDS } from '@/integrations/facebook/constants';
import {getOrCreateCustomer} from '@/integrations/facebook/controller/store'
import {receiveTrpcMessage} from '@/inbox/receiveMessage'
// import {conversationClientMessageInserted} from '@/inbox/graphql/resolvers/mutations/widget'

// backend/plugins/frontline_api/src/modules/inbox/graphql/resolvers/mutations/widget.ts
export const receiveMessage = async (
  models: IModels,
  subdomain: string,
  integration: IFacebookIntegrationDocument,
  activity: Activity
) => {
  const {
  recipient,
  sender,
  timestamp,
  attachments = [],
  message: originalMessage,
  postback
} = activity.channelData as IChannelData;

let adData;
let message = originalMessage;
let text = message?.text || "";

if (!text && !message && !!postback) {
  text = postback.title;

  message = {
    mid: postback.mid
  };

  if (postback.payload) {
    message.payload = postback.payload;
  }
}

if (message?.quick_reply) {
  message.payload = message.quick_reply.payload;
}

  const userId = sender.id;
  const pageId = recipient.id;
  const kind = INTEGRATION_KINDS.MESSENGER;

  // get or create customer
  const customer = await getOrCreateCustomer(
    models,
    subdomain,
    pageId,
    userId,
    kind
  );

  // get conversation
  let conversation = await models.FacebookConversations.findOne({
    senderId: userId,
    recipientId: recipient.id
  });

//   const bot = await checkIsBot(models, message, recipient.id);
//   const botId = bot?._id;

//   if (message.referral && bot) {
//     const referral = message.referral;
//     adData = {
//       type: "text",
//       text: `<div class="ads"> 
//               <img src="${referral.ads_context_data.photo_url}" alt="${referral.ads_context_data.ad_title}"/>
//               <h5>${referral.ads_context_data.ad_title}</h5>
//             </div>`,
//       mid: message.mid,
//       adId: referral.ad_id,
//       postId: referral.ads_context_data.post_id,
//       messageText: text,
//       pageId: recipient.id
//     };
//   }

  // <a href="${referral.ads_context_data.post_id}">See ads in facebook</a>

  // create conversation
  if (!conversation) {
    // save on integrations db

    try {
      conversation = await models.FacebookConversations.create({
        timestamp,
        senderId: userId,
        recipientId: recipient.id,
        content: text,
        integrationId: integration._id,
        // isBot: !!botId,
        // botId
      });
    } catch (e) {
      throw new Error(
        e.message.includes("duplicate")
          ? "Concurrent request: conversation duplication"
          : e
      );
    }
  } else {
    // const bot = await models.Bots.findOne({ _id: botId });

    // if (bot) {
    //   conversation.botId = botId;
    // }
    // conversation.content = text || "";
  }

  const formattedAttachments = (attachments || [])
    .filter((att) => att.type !== "fallback")
    .map((att) => ({
      type: att.type,
      url: att.payload ? att.payload.url : ""
    }));

  // save on api
    try {
        const apiConversationResponse = await receiveTrpcMessage(subdomain, {
          pluginName: 'inbox',
          method: 'mutation',
          module: 'integrations',
          action: 'receive',
          input: {
            action: 'create-or-update-conversation',
            payload: JSON.stringify({
              customerId: customer.erxesApiId,
              integrationId: integration.erxesApiId,
              content: text || '',
              attachments: formattedAttachments,
              conversationId: conversation.erxesApiId,
              updatedAt: timestamp,
            }),
          },
        });

        console.log(apiConversationResponse,'apiConversationResponse')


    // conversation.erxesApiId = apiConversationResponse._id;

    // await conversation.save();
  } catch (e) {
    await models.FacebookConversations.deleteOne({ _id: conversation._id });
    throw new Error(e);
  }
  // get conversation message
  const conversationMessage = await models.FacebookConversationMessages.findOne({
    mid: message.mid
  });

  if (!conversationMessage) {
    try {
      // if (adData) {
      //   const adsMessage = await models.FacebookConversationMessages.addMessage({
      //     conversationId: conversation._id,
      //     content: "<p>Conversation started from Facebook ads </p>",
      //     botData: [adData],
      //     fromBot: true,
      //     mid: adData.mid,
      //     createdAt: new Date(new Date(timestamp).getTime() - 500)
      //   });
      // await sendInboxMessage
        // await sendInboxMessage({
        //   subdomain,
        //   action: "conversationClientMessageInserted",
        //   data: {
        //     ...adsMessage.toObject(),
        //     conversationId: conversation.erxesApiId
        //   }
        // });
      // }
      const created = await models.FacebookConversationMessages.create({
        conversationId: conversation._id,
        mid: message.mid,
        createdAt: timestamp,
        content: text,
        customerId: customer.erxesApiId,
        attachments: formattedAttachments,
      });

    //   await sendInboxMessage({
    //     subdomain,
    //     action: "conversationClientMessageInserted",
    //     data: {
    //       ...created.toObject(),
    //       conversationId: conversation.erxesApiId
    //     }
    //   });

    //   graphqlPubsub.publish(
    //     `conversationMessageInserted:${conversation.erxesApiId}`,
    //     {
    //       conversationMessageInserted: {
    //         ...created.toObject(),
    //         conversationId: conversation.erxesApiId
    //       }
    //     }
    //   );
    //   conversationMessage = created;

    //   await handleAutomation(subdomain, {
    //     conversationMessage,
    //     payload: message?.payload,
    //     adData
    //   });
    } catch (e) {
      throw new Error(
        e.message.includes("duplicate")
          ? "Concurrent request: conversation message duplication"
          : e
      );
    }
  }
};