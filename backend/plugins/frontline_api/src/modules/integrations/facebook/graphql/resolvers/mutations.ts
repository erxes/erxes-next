import { IContext } from '~/connectionResolvers';
import { repairIntegrations, updateConfigs } from '@/integrations/facebook/helpers';
import { IReplyParams } from '@/integrations/facebook/@types/utils';
import {sendReply} from '@/integrations/facebook/utils';
export const facebookMutations = {
  async facebookUpdateConfigs(_root, { configsMap }, { models }: IContext) {
    await updateConfigs(models, configsMap);

    return { status: 'ok' };
  },
  async facebookRepair(
    _root,
    { _id }: { _id: string },
    { subdomain, models }: IContext,
  ) {
    await repairIntegrations(subdomain, models, _id);

    return 'success';
  },




  async facebookReplyToComment(
    _root,
    params: IReplyParams,
    { models }: IContext,
  ) {
    const { commentId, content, attachments, conversationId } = params;

     const comment = await models.FacebookCommentConversation.findOne({ comment_id: commentId });

    const post = await models.FacebookPostConversations.findOne({
      $or: [
        { erxesApiId: conversationId },
        { postId: comment ? comment.postId : '' },
      ],
    });

    if (!post) {
      throw new Error('Post not found');
    }

    const { recipientId } = post;

    let attachment: {
      url?: string;
      type?: string;
      payload?: { url: string };
    } = {};

    if (attachments && attachments.length > 0) {
      attachment = {
        type: 'file',
        payload: {
          url: attachments[0].url,
        },
      };
    }

    let data = {
      message: content,
      attachment_url: attachment.url,
    };

    const id = comment ? comment.comment_id : post.postId;

    if (comment && comment.comment_id) {
      data = {
        message: ` @[${comment.senderId}] ${content}`,
        attachment_url: attachment.url,
      };
    }

    try {
      const inboxConversation =await models.FacebookConversations.findOne({ _id: conversationId });

      await sendReply(
        models,
        `${id}/comments`,
        data,
        recipientId,
        inboxConversation && inboxConversation.integrationId || ''
      );

    //   sendInboxMessage({
    //     action: 'sendNotifications',
    //     isRPC: false,
    //     subdomain,
    //     data: {
    //       user,
    //       conversations: [inboxConversation],
    //       type: 'conversationStateChange',
    //       mobile: true,
    //       messageContent: content,
    //     },
    //   });

      return { status: 'success' };
    } catch (e) {
      throw new Error(e.message);
    }
  },
};
