import { IChannelDocument, IChannel, IChannelsEdit } from '@/inbox/@types/channels';
import { checkUserIds } from 'erxes-api-shared/utils';

import { IContext } from '~/connectionResolvers';

/**
 * Send notification to all members of this channel except the sender
 */
export const sendChannelNotifications = async (
  subdomain: string,
  channel: IChannelDocument,
  type: 'invited' | 'removed',
  user: any,
  receivers?: string[],
) => {
  let action = `invited you to the`;

  if (type === 'removed') {
    action = `removed you from`;
  }
};

export const channelMutations = {
  /**
   * Create a new channel and send notifications to its members bar the creator
   */
  async channelsAdd(
    _root,
    doc: IChannel,
    { user, models, subdomain}: IContext,
  ) {
    const channel = await models.Channels.createChannel(doc, user._id);
    await sendChannelNotifications(subdomain, channel, 'invited', user);

    return channel;
  },

  /**
   * Update channel data
   */
  async channelsEdit(
    _root,
    { _id, ...doc }: IChannelsEdit,
    { user, models, subdomain }: IContext
  ) {
    const channel = await models.Channels.getChannel(_id);

    const { addedUserIds, removedUserIds } = checkUserIds(
      channel.memberIds || [],
      doc.memberIds || []
    );

    const updated = await models.Channels.updateChannel(_id, doc);

    await sendChannelNotifications(
      subdomain,
      channel,
      'invited',
      user,
      addedUserIds
    );
    await sendChannelNotifications(
      subdomain,
      channel,
      'removed',
      user,
      removedUserIds
    );


    return updated;
  },

  /**
   * Remove a channel
   */
  async channelsRemove(
    _root,
    { _id }: { _id: string },
    { user, models, subdomain }: IContext,
  ) {
    const channel = await models.Channels.getChannel(_id);
    await sendChannelNotifications(subdomain, channel, 'removed', user);

    return true;
  },
};
