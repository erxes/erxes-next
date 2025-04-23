import { IIntegrationDocument } from '@/inbox/@types/integrations';

import { IContext } from '~/connectionResolvers';

export default {
  async __resolveReference({ _id }, { models }: IContext) {
    return models.Integrations.findOne({ _id });
  },
  brand(integration: IIntegrationDocument) {
    if (!integration.brandId) {
      return null;
    }
    return (
      integration.brandId && {
        __typename: 'Brand',
        _id: integration.brandId,
      }
    );
  },

  async form(
    integration: IIntegrationDocument,
    _args,
    { subdomain }: IContext,
  ) {
    return null;
  },

  async channels(
    integration: IIntegrationDocument,
    _args,
    { models }: IContext,
  ) {
    return models.Channels.find({
      integrationIds: { $in: [integration._id] },
    });
  },

  async tags(integration: IIntegrationDocument) {
    return (integration.tagIds || []).map((_id) => ({
      __typename: 'Tag',
      _id,
    }));
  },

  async websiteMessengerApps(
    integration: IIntegrationDocument,
    _args,
    { models }: IContext,
  ) {
    return [];
  },

  async knowledgeBaseMessengerApps(
    integration: IIntegrationDocument,
    _args,
    { models }: IContext,
  ) {
    return [];
  },

  async leadMessengerApps(
    integration: IIntegrationDocument,
    _args,
    { models }: IContext,
  ) {
    return [];
  },

  async healthStatus(
    integration: IIntegrationDocument,
    _args,
    { subdomain }: IContext,
  ) {
    const kind = integration.kind.includes('facebook')
      ? 'facebook'
      : integration.kind.split('-')[0];

    if (kind === 'messenger') {
      return { status: 'healthy' };
    }

    return { status: 'healthy' };
  },

  async details(
    integration: IIntegrationDocument,
    _args,
    { subdomain }: IContext,
  ) {
    const inboxId: string = integration._id;

    const serviceName = integration.kind.includes('facebook')
      ? 'facebook'
      : integration.kind;

    if (integration.kind === 'messenger') {
      return null;
    }

    return serviceName;
  },

  async callData(
    integration: IIntegrationDocument,
    _args,
    { subdomain }: IContext,
  ) {
    const inboxId: string = integration._id;

    if (integration.kind !== 'messenger') {
      return null;
    }
    return 'success';
  },
};
