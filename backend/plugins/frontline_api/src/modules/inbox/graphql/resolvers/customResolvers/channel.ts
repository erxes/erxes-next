import { IChannelDocument } from '@/inbox/@types/channels';
import { IContext } from '~/connectionResolvers';
import { sendTRPCMessage } from 'erxes-api-shared/utils';
export default {
  async integrations(channel: IChannelDocument, _args, { models }: IContext) {
    return models.Integrations.findIntegrations({
      _id: { $in: channel.integrationIds },
    });
  },

  async members(channel: IChannelDocument, _args, { subdomain }: IContext) {
    
    return await sendTRPCMessage({
          pluginName: 'core',
          method: 'query', 
          module: 'users',
          action: 'find',
          input: {
            doc: {
              _id: { $in: channel.memberIds },
              isActive: { $ne: false },
            },
          },
        });
  },
};
