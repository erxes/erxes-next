import { generateModels, IModels } from '~/connectionResolvers';
import { debugError } from '@/integrations/facebook/debuggers';
import { checkContentConditions } from '@/integrations/facebook/meta/automation/utils/messageUtils';
import { sendReply } from '@/integrations/facebook/utils';

export const actionCreateComment = async (
  models: IModels,
  subdomain,
  action,
  execution,
) => {
  try {
    const { target = {} } = execution || {};
    const { config } = action || {};

    const { recipientId, comment_id, senderId, erxesApiId } = target;
    const { text, attachments } = config;

    const data: any = {
      message: `@[${senderId}] ${text}`,
    };

    if (!!attachments?.length) {
      const url = attachments[0].url;
      data.attachment_url = url;
    }

    const inboxConversation = await models.FacebookConversations.findOne({
      _id: erxesApiId,
    });

    if (!inboxConversation) {
      throw new Error('No inbox conversation found');
    }

    await sendReply(
      models,
      `${comment_id}/comments`,
      data,
      recipientId,
      inboxConversation.integrationId,
    );

    await models.FacebookCommentConversationReply.create({
      recipientId: recipientId,
      senderId: senderId,
      attachments: attachments,
      createdAt: new Date(Date.now()),
      content: `${text}`,
      parentId: comment_id,
    });

    return { status: 'success' };
  } catch (error) {
    debugError(error.message);
    throw new Error(error.message);
  }
};

export const checkCommentTrigger = async (subdomain, { target, config }) => {
  const { botId, postId, postType, checkContent, conditions, onlyFirstLevel } =
    config || {};

  const models = await generateModels(subdomain);

  const bot = await models.FacebookBots.findOne(
    {
      _id: botId,
      pageId: target?.recipientId,
    },
    { _id: 1 },
  ).lean();

  if (!bot) {
    return;
  }

  if (postType === 'specific' && target.postId !== postId) {
    return false;
  }

  if (onlyFirstLevel && target.parentId) {
    return false;
  }

  return !checkContent
    ? true
    : checkContentConditions(target?.content || '', conditions);
};
