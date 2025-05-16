import {
  IIntegrationDocument,
  IIntegration,
  IMessengerData,
  IUiOptions,
} from '@/inbox/@types/integrations';
import { IContext, IModels } from '~/connectionResolvers';
import { IExternalIntegrationParams } from '@/inbox/db/models/Integrations';

const createIntegration = async (
  models: IModels,
  subdomain: string,
  doc: IIntegration,
  integration: IIntegrationDocument,
  user: any,
  type: string,
) => {
  if (doc.channelIds) {
    await models.Channels.updateMany(
      { _id: { $in: doc.channelIds } },
      { $push: { integrationIds: integration._id } },
    );
  }

  return integration;
};

const editIntegration = async (
  subdomain: string,
  fields: IIntegration,
  integration: IIntegrationDocument,
  user,
  updated: IIntegrationDocument,
  models: IModels,
) => {
  await models.Channels.updateMany(
    { integrationIds: integration._id },
    { $pull: { integrationIds: integration._id } },
  );

  if (fields.channelIds) {
    await models.Channels.updateMany(
      { _id: { $in: fields.channelIds } },
      { $push: { integrationIds: integration._id } },
    );
  }

  return updated;
};

export const integrationMutations = {
  /**
   * Creates a new messenger onboarding
   */
  async integrationsCreateMessengerOnboarding(
    _root,
    doc: any,
    { user, models, subdomain }: IContext,
  ) {
    const integrationsCount = await models.Integrations.countDocuments();

    if (integrationsCount > 0) {
      return models.Integrations.findOne();
    }

    const channel = await models.Channels.findOne({ name: 'Default channel' });

    if (!channel) {
      await models.Channels.createChannel(
        { name: 'Default channel', memberIds: [user._id] },
        user._id,
      );
    }
    const integrationDocs = {
      name: 'Default brand',
      channelIds: [channel!._id],
      messengerData: {},
    } as IIntegration;

    const integration = await models.Integrations.createMessengerIntegration(
      integrationDocs,
      user._id,
    );

    const uiOptions = { ...doc };

    await models.Integrations.saveMessengerAppearanceData(
      integration._id,
      uiOptions,
    );

    return createIntegration(
      models,
      subdomain,
      integrationDocs,
      integration,
      user,
      'messenger',
    );
  },

  async integrationsEditMessengerOnboarding(
    _root,
    { _id, brandId, ...fields }: any,
    { user, models, subdomain }: IContext,
  ) {
    const integration = await models.Integrations.getIntegration({ _id });
    const channel = await models.Channels.findOne({
      name: 'Default channel',
    });

    const integrationDocs = {
      name: 'Default brand',
      channelIds: [channel?._id],
    } as IIntegration;

    const updated = await models.Integrations.updateMessengerIntegration(
      _id,
      integrationDocs,
    );

    const uiOptions = { logo: fields.logo, color: fields.color };

    await models.Integrations.saveMessengerAppearanceData(
      updated._id,
      uiOptions,
    );

    return editIntegration(
      subdomain,
      integrationDocs,
      integration,
      user,
      updated,
      models,
    );
  },

  /**
   * Creates a new messenger integration
   */

  async integrationsCreateMessengerIntegration(
    _root,
    doc: IIntegration,
    { user, models, subdomain }: IContext,
  ) {
    const integration = await models.Integrations.createMessengerIntegration(
      doc,
      user._id,
    );

    return createIntegration(
      models,
      subdomain,
      doc,
      integration,
      user,
      'messenger',
    );
  },

  /**
   * Updates a messenger integration
   */
  async integrationsEditMessengerIntegration(
    _root,
    { _id, ...fields }: any,
    { user, models, subdomain }: IContext,
  ) {
    const integration = await models.Integrations.getIntegration({ _id });
    const updated = await models.Integrations.updateMessengerIntegration(
      _id,
      fields,
    );

    return editIntegration(
      subdomain,
      fields,
      integration,
      user,
      updated,
      models,
    );
  },

  /**
   * Update/save messenger appearance data
   */
  async integrationsSaveMessengerAppearanceData(
    _root,
    { _id, uiOptions }: { _id: string; uiOptions: IUiOptions },
    { models }: IContext,
  ) {
    return models.Integrations.saveMessengerAppearanceData(_id, uiOptions);
  },

  /**
   * Update/save messenger data
   */
  async integrationsSaveMessengerConfigs(
    _root,
    {
      _id,
      messengerData,
      callData,
    }: { _id: string; messengerData: IMessengerData; callData: any },
    { models, subdomain }: IContext,
  ) {
    return models.Integrations.saveMessengerConfigs(_id, messengerData);
  },

  /**
   * Create a new messenger integration
   */
  async integrationsCreateLeadIntegration(
    _root,
    doc: IIntegration,
    { user, models, subdomain }: IContext,
  ) {
    const integration = await models.Integrations.createLeadIntegration(
      doc,
      user._id,
    );

    return createIntegration(models, subdomain, doc, integration, user, 'lead');
  },

  /**
   * Edit a lead integration
   */
  async integrationsEditLeadIntegration(
    _root,
    { _id, ...doc }: any,
    { user, models, subdomain }: IContext,
  ) {
    const integration = await models.Integrations.getIntegration({ _id });

    const updated = await models.Integrations.updateLeadIntegration(_id, doc);

    return editIntegration(subdomain, doc, integration, user, updated, models);
  },

  /**
   * Create external integrations like twitter, gmail etc ...
   */
  async integrationsCreateExternalIntegration(
    _root,
    { data, ...doc }: IExternalIntegrationParams & { data: object },
    { user, models, subdomain }: IContext,
  ) {
    const modifiedDoc: any = { ...doc };

    if (modifiedDoc.kind === 'webhook') {
      modifiedDoc.webhookData = { ...data };
    }

    if (doc.channelIds && doc.channelIds.length === 0) {
      throw new Error('Channel must be chosen');
    }

    const integration = await models.Integrations.createExternalIntegration(
      modifiedDoc,
      user._id,
    );

    if (doc.channelIds) {
      await models.Channels.updateMany(
        { _id: { $in: doc.channelIds } },
        { $push: { integrationIds: integration._id } },
      );
    }

    const kind = doc.kind.split('-')[0];
    if (kind === 'cloudflarecalls') {
      data = { ...data, name: doc.name };
    }

    return integration;
  },

  async integrationsEditCommonFields(
    _root,
    { _id, name, brandId, channelIds, details },
    { user, models, subdomain }: IContext,
  ) {
    const integration = await models.Integrations.getIntegration({ _id });

    const doc: any = { name, brandId, details };

    let { kind } = integration;
    if (kind === 'facebook-messenger' || kind === 'facebook-post') {
      kind = 'facebook';
    }
    if (kind === 'instagram-messenger' || kind === 'instagram-post') {
      kind = 'instagram';
    }
    await models.Integrations.updateOne({ _id }, { $set: doc });

    const updated = await models.Integrations.getIntegration({ _id });

    await models.Channels.updateMany(
      { integrationIds: integration._id },
      { $pull: { integrationIds: integration._id } },
    );

    if (channelIds) {
      await models.Channels.updateMany(
        { _id: { $in: channelIds } },
        { $push: { integrationIds: integration._id } },
      );
    }

    return updated;
  },

  /**
   * Deletes an integration
   */
  async integrationsRemove(
    _root,
    { _id }: { _id: string },
    { user, models, subdomain }: IContext,
  ) {
    return models.Integrations.removeIntegration(_id);
  },

  /**
   * Delete an account
   */
  async integrationsRemoveAccount(
    _root,
    { _id, kind }: { _id: string; kind?: string },
    { models, subdomain }: IContext,
  ) {
    for (const id of _id) {
      await models.Integrations.removeIntegration(id);
    }

    return 'success';
  },

  async integrationsRepair(
    _root,
    { _id, kind }: { _id: string; kind: string },
    { subdomain }: IContext,
  ) {
    return 'success';
  },

  async integrationsArchive(
    _root,
    { _id, status }: any,
    { user, models, subdomain }: IContext,
  ) {
    await models.Integrations.updateOne(
      { _id },
      { $set: { isActive: !status } },
    );

    const updated = await models.Integrations.findOne({ _id });

    return updated;
  },

  async integrationsSendSms(_root, args: any, { user, subdomain }: IContext) {
    return 'success';
  },

  async integrationsCopyLeadIntegration(
    _root,
    { _id }: { _id },
    { docModifier, user, models, subdomain }: IContext,
  ) {
    const sourceIntegration = await models.Integrations.getIntegration({ _id });

    if (!sourceIntegration.formId) {
      throw new Error('Integration kind is not form');
    }

    return sourceIntegration;
  },
};
