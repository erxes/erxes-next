import { stripHtml } from 'strip-html';
import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { IModels } from '~/connectionResolvers';
import { sendReply, generateAttachmentMessages } from '@/integrations/facebook/utils'
import DOMPurify from 'dompurify';
// import { generateAttachmentMessages, sendReply } from './utils';
// import { sendInboxMessage } from './messageBroker';
// import { sendCoreMessage } from './messageBroker';

/**
 * Handle requests from erxes api
 */
export const handleFacebookMessage = async (
  models: IModels,
  msg,
  subdomain
) => {
  const { action, payload } = msg;
  const doc = JSON.parse(payload || '{}');
  if (doc.internal) {
    const conversation = await models.FacebookConversations.getConversation({
      erxesApiId: doc.conversationId
    });

    return models.ConversationMessages.addMessage(
      {
        ...doc,
        conversationId: conversation._id
      },
      doc.userId
    );
  }
  if (action === 'reply-post') {
    const {
      conversationId,
      content = '',
      attachments = [],
      userId
    } = doc;
    const commentConversationResult = await models.FacebookCommentConversation.findOne({
      erxesApiId: conversationId
    });

    const post = await models.FacebookPostConversations.findOne({
      $or: [
        { erxesApiId: conversationId },
        {
          postId: commentConversationResult
            ? commentConversationResult.postId
            : ''
        }
      ]
    });
    if (!commentConversationResult) {
      throw new Error('comment not found');
    }
    if (!post) {
      throw new Error('Post not found');
    }
    let strippedContent = stripHtml(content).result;

    strippedContent = strippedContent.replace(/&amp;/g, '&');

    const { recipientId, comment_id, senderId } = commentConversationResult;
    await models.FacebookCommentConversationReply.create({
      recipientId: recipientId,
      senderId: senderId,
      attachments: attachments,
      userId: userId,
      createdAt: new Date(Date.now()),
      content: strippedContent,
      parentId: comment_id
    });

    let attachment: {
      url?: string;
      type?: string;
      payload?: { url: string };
    } = {};

    if (attachments && attachments.length > 0) {
      attachment = {
        type: 'file',
        payload: {
          url: attachments[0].url
        }
      };
    }
    let data = {
      message: strippedContent,
      attachment_url: attachment.payload ? attachment.payload.url : undefined
    };
    const id = commentConversationResult
      ? commentConversationResult.comment_id
      : post.postId;
    if (commentConversationResult && commentConversationResult.comment_id) {
      data = {
        message: ` @[${commentConversationResult.senderId}] ${strippedContent}`,
        attachment_url: attachment.payload ? attachment.payload.url : undefined
      };
    }
    try {
        const inboxConversation = await models.Conversations.findOne({
          _id: conversationId
        })

        if(!inboxConversation){
          throw new Error('conversation not found');
        }

        await sendReply(
          models,
          `${id}/comments`,
          data,
          recipientId,
         inboxConversation.integrationId
        );
 
     const user = await sendTRPCMessage({
        pluginName: 'core',
        method: 'query',
        module: 'users',
        action: 'findOne',
        input: { _id: userId },
      });

      if (user) {
  
        return { status: 'success' };
      } else {
        throw new Error('User not found');
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }

  if (action === 'reply-messenger') {
    const {
      integrationId,
      conversationId,
      content = '',
      attachments = [],
      extraInfo
    } = doc;

    const tag = extraInfo?.tag || '';

    // Extract image URLs from the content
    const images = (content.match(/<img[^>]* src="([^"]*)"/g) || []).map(
      (img) => img.match(/src="([^"]*)"/)[1]
    );
    images.forEach((img) => attachments.push({ type: 'image', url: img }));

    // Strip HTML tags and format the content

    function sanitizeAndFormat(html: string): string {
      // Remove all tags and any malicious content
      const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
      // Preserve paragraph breaks, then trim whitespace
      return clean
        .replace(/<\/p>/g, '\n')
        .trim();
     }

   const strippedContent = sanitizeAndFormat(content);

    const conversation = await models.FacebookConversations.getConversation({
      erxesApiId: conversationId
    });
    const { senderId } = conversation;
    let localMessage;

    try {
      // Send text message if strippedContent is not empty
      if (strippedContent) {
        const resp = await sendReply(
          models,
          'me/messages',
          {
            recipient: { id: senderId },
            message: { text: strippedContent },
            tag
          },
          conversation.recipientId,
          integrationId
        );

        if (resp) {
          localMessage = await models.FacebookConversationMessages.addMessage(
            {
              ...doc,
              conversationId: conversation._id,
              mid: resp.message_id
            },
            doc.userId
          );
        }
      }

      // Send attachments
      for (const message of generateAttachmentMessages(
        subdomain,
        attachments
      )) {
        const resp = await sendReply(
          models,
          'me/messages',
          {
            recipient: { id: senderId },
            message,
            tag
          },
          conversation.recipientId,
          integrationId
        );

        if (resp) {
          localMessage = await models.FacebookConversationMessages.addMessage(
            {
              ...doc,
              conversationId: conversation._id,
              mid: resp.message_id
            },
            doc.userId
          );
        }
      }
    } catch (e) {
      if (localMessage) {
        await models.FacebookConversationMessages.deleteOne({ _id: localMessage._id });
      }
      throw new Error(e.message);
    }

    return {
      status: 'success',
      data: { ...localMessage.toObject(), conversationId }
    };
  }
};
