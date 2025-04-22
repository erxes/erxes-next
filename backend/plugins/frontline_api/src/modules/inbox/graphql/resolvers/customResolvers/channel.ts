import { IChannelDocument } from '@/inbox/@types/channels';
import { IContext } from '~/connectionResolvers';
export default {
  async integrations(channel: IChannelDocument, _args, { models }: IContext) {
    return models.Integrations.findIntegrations({
      _id: { $in: channel.integrationIds },
    });
  },

  async members(channel: IChannelDocument, _args, { subdomain }: IContext) {
    return null;
  },
};
