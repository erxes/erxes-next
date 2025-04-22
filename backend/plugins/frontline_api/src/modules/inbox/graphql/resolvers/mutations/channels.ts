import { IChannelDocument, IChannel } from '@/inbox/@types/channels';

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
    { user, models, subdomain }: IContext,
  ) {
    const channel = await models.Channels.createChannel(doc, user._id);

    return channel;
  },

  /**
   * Update channel data
   */
  async channelsEdit(
    _root,
    { _id, ...doc }: any,
    { user, models, subdomain }: IContext,
  ) {
    const channel = await models.Channels.getChannel(_id);

    const updated = await models.Channels.updateChannel(_id, doc);

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
    await models.Channels.removeChannel(_id);
    return true;
  },
};
