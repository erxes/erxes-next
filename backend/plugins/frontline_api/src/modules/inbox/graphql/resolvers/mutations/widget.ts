import { graphqlPubsub } from 'erxes-api-shared/utils';
export const pConversationClientMessageInserted = async (
  models,
  subdomain,
  message: { _id: string; [other: string]: any },
) => {
  const conversation = await models.Conversations.findOne(
    {
      _id: message.conversationId,
    },
    { integrationId: 1 },
  );

  let integration;

  if (conversation) {
    integration = await models.Integrations.findOne(
      {
        _id: conversation.integrationId,
      },
      { _id: 1, name: 1 },
    );
  }

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

  (graphqlPubsub.publish as (trigger: string, payload: any) => Promise<void>)(
    `conversationMessageInserted:${conversation._id}`,
    {
      conversationMessageInserted: message,
      subdomain,
      conversation,
      integration,
    },
  );

  for (const userId of channelMemberIds) {
    await (
      graphqlPubsub.publish as (trigger: string, payload: any) => Promise<void>
    )(`conversationClientMessageInserted:${subdomain}:${userId}`, {
      conversationClientMessageInserted: message,
      subdomain,
      conversation,
      integration,
    });
  }
};
