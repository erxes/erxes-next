import { getPlugin, getPlugins } from 'erxes-api-shared/utils';
export const MODULE_NAMES = {
  CHANNEL: 'channel',
  EMAIL_TEMPLATE: 'emailTemplate',
  RESPONSE_TEMPLATE: 'responseTemplate',
  CONVERSATION: 'conversation',
  CONVERSATION_MESSAGE: 'conversation_message',
  INTEGRATION: 'integration',
  SCRIPT: 'script',
};

export const getIntegrationMeta = async () => {
  const serviceNames = await getPlugins();
  let metas: any = [];

  for (const serviceName of serviceNames) {
    const service = await getPlugin(serviceName);
    const inboxIntegrations =
      (service.config.meta || {}).inboxIntegrations || [];

    if (inboxIntegrations && inboxIntegrations.length > 0) {
      metas = metas.concat(inboxIntegrations);
    }
  }

  return metas;
};

export const getIntegrationsKinds = async () => {
  const metas = await getIntegrationMeta();

  const response = {
    messenger: 'Messenger',
    lead: 'Popups & forms',
    webhook: 'Webhook',
    callpro: 'Callpro',
  };

  for (const meta of metas) {
    response[meta.kind] = meta.label;
  }

  return response;
};

export const isServiceRunning = async (
  integrationKind: string,
): Promise<boolean> => {
  const serviceNames = await getPlugins();

  // some kinds are separated by -
  return (
    !!integrationKind && serviceNames.includes(integrationKind.split('-')[0])
  );
};