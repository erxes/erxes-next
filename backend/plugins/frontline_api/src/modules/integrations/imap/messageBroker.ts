import { generateModels } from '~/connectionResolvers';
import { listenIntegration } from '~/modules/integrations/imap/utils';

interface SendImapMessageArgs {
  subdomain: string;
  action?: string;
  data: {
    _id: string;
  };
}

export async function imapCreateIntegrations({ subdomain, data }) {
  try {
    const models = await generateModels(subdomain);

    const integration = await models.ImapIntegrations.create({
      inboxId: data.integrationId,
      healthStatus: 'healthy',
      error: '',
      ...JSON.parse(data),
    });

    listenIntegration(subdomain, integration, models);

    await models.ImapLogs.createLog({
      type: 'info',
      message: `Started syncing ${integration.user}`,
    });

    return {
      status: 'success',
    };
  } catch (e) {
    return {
      status: 'error',
      errorMessage: `Failed to create integration: ${e.message}`,
    };
  }
}

export async function imapUpdateIntegrations({
  subdomain,
  data: { integrationId, doc },
}) {
  try {
    const detail = JSON.parse(doc.data);
    const models = await generateModels(subdomain);

    const integration = await models.ImapIntegrations.findOne({
      inboxId: integrationId,
    });

    if (!integration) {
      return {
        status: 'error',
        errorMessage: 'Integration not found.',
      };
    }

    detail.healthStatus = 'healthy';
    detail.error = '';

    await models.ImapIntegrations.updateOne(
      { inboxId: integrationId },
      { $set: detail },
    );

    const updatedIntegration = await models.ImapIntegrations.findOne({
      inboxId: integrationId,
    });

    if (updatedIntegration) {
      listenIntegration(subdomain, integration, models);
    }

    return {
      status: 'success',
    };
  } catch (e) {
    return {
      status: 'error',
      errorMessage: `Failed to update integration: ${e.message}`,
    };
  }
}

export async function imapRemoveIntegrations({
  subdomain,
  data: { integrationId },
}) {
  try {
    const models = await generateModels(subdomain);

    await models.ImapMessages.deleteMany({
      inboxIntegrationId: integrationId,
    });
    await models.ImapCustomers.deleteMany({
      inboxIntegrationId: integrationId,
    });
    await models.ImapIntegrations.deleteMany({
      inboxId: integrationId,
    });

    return {
      status: 'success',
    };
  } catch (e) {
    return {
      status: 'error',
      errorMessage: `Failed to remove integration: ${e.message}`,
    };
  }
}

export async function sendImapMessage({
  subdomain,
  data: { _id },
}: SendImapMessageArgs) {
  const models = await generateModels(subdomain);

  const integration = await models.ImapIntegrations.findById(_id);

  if (!integration) {
    console.log(`Queue: imap:listen. Integration not found ${_id}`);
    return;
  }

  listenIntegration(subdomain, integration, models);

  return { status: 'success' };
}

export async function ImapListen({
  subdomain,
  data: { _id },
}: SendImapMessageArgs) {
  const models = await generateModels(subdomain);
  const integration = await models.ImapIntegrations.findById(_id);
  if (!integration) {
    console.log(`Queue: imap:listen. Integration not found ${_id}`);
    return;
  }

  listenIntegration(subdomain, integration, models);
}
