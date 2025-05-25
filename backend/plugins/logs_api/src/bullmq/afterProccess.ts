import {
  getPlugin,
  getPlugins,
  IAfterProcessRule,
  sendWorkerMessage,
} from 'erxes-api-shared/utils';
import { AfterProcessProps } from '~/types';

interface WorkerMessage {
  serviceName: string;
  queueName: string;
  jobName: string;
  subdomain: string;
  data: any;
}

type ProcessHandlerProps = {
  subdomain: string;
  pluginName: string;
  rules: IAfterProcessRule[];
  payload: any;
  contentType?: string;
  action: string;
};

function getAllKeys(obj, prefix = '') {
  let keys: string[] = [];
  for (let key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    keys.push(fullKey);
    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    }
  }
  return keys;
}

const sendProcessMessage = async (message: WorkerMessage): Promise<void> => {
  try {
    sendWorkerMessage(message);
  } catch (error) {
    console.error(
      `Failed to send worker message: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
};

const handleAfterMutation = ({
  subdomain,
  pluginName,
  rules,
  payload,
}: ProcessHandlerProps): void => {
  const rule = rules.find((rule) => rule.type === 'afterMutation');

  if (rule) {
    const { mutationNames = [] } = rule || {};
    const { mutationName } = payload || {};

    if (mutationNames.includes(mutationName)) {
      sendProcessMessage({
        serviceName: pluginName,
        queueName: 'afterProcess',
        jobName: 'onAfterMutation',
        subdomain,
        data: payload,
      });
    }
  }
};

const handleUpdatedDocument = ({
  subdomain,
  pluginName,
  rules,
  payload,
  contentType,
}: ProcessHandlerProps): void => {
  const rule = rules.find((rule) => rule.type === 'updatedDocument');
  if (rule) {
    const { contentTypes = [], when } = rule;

    if (contentTypes.includes(contentType || '')) {
      let shouldSend = true;

      if (when) {
        const { updatedFields = [], removedFields = [] } =
          payload.updateDescription;

        const hasRemovedFieldsExists = getAllKeys(removedFields).some((key) =>
          (when.fieldsRemoved || []).includes(key),
        );
        const hasUpdatedFieldsExists = getAllKeys(updatedFields).some((key) =>
          (when.fieldsUpdated || []).includes(key),
        );

        shouldSend = hasRemovedFieldsExists || hasUpdatedFieldsExists;
      }

      if (shouldSend) {
        sendProcessMessage({
          serviceName: pluginName,
          queueName: 'afterProcess',
          jobName: 'onDocumentUpdated',
          subdomain,
          data: payload,
        });
      }
    }
  }
};

const handleCreateDocument = ({
  subdomain,
  pluginName,
  rules,
  payload,
  contentType,
}: ProcessHandlerProps): void => {
  const rule = rules.find((rule) => rule.type === 'createdDocument');

  if (rule) {
    const document = payload?.fullDocument;

    const { contentTypes = [], when } = rule;

    if (contentTypes.includes(contentType || '')) {
      let shouldSend = true;
      if (when) {
        const { fieldsWith = [] } = when || {};
        const hasFieldsExists = getAllKeys(document).some((key) =>
          fieldsWith.includes(key),
        );
        shouldSend = hasFieldsExists;
      }

      if (shouldSend) {
        sendProcessMessage({
          serviceName: pluginName,
          queueName: 'afterProcess',
          jobName: 'onDocumentCreated',
          subdomain,
          data: payload,
        });
      }
    }
  }
};

const handleAfterAPIRequest = ({
  subdomain,
  pluginName,
  rules,
  payload,
}: ProcessHandlerProps): void => {
  const rule = rules.find((rule) => rule.type === 'afterAPIRequest');

  if (rule) {
    const { paths = [] } = rule;
    const { path } = payload || {};
    if (paths.includes(path)) {
      sendProcessMessage({
        serviceName: pluginName,
        queueName: 'afterProcess',
        jobName: 'onAfterApiRequest',
        subdomain,
        data: payload,
      });
    }
  }
};

const handleAfterAuth = ({
  subdomain,
  pluginName,
  rules,
  payload,
  action,
}: ProcessHandlerProps): void => {
  const rule = rules.find((rule) => rule.type === 'afterAuth');

  if (rule && (rule?.types || []).includes(action)) {
    sendProcessMessage({
      serviceName: pluginName,
      queueName: 'afterProcess',
      jobName: 'onAfterAuth',
      subdomain,
      data: {
        userId: payload.userId,
        email: payload.email,
        result: payload.result,
      },
    });
  }
};

export const handleAfterProcess = async (
  subdomain: string,
  { source, action, payload, contentType }: AfterProcessProps,
): Promise<void> => {
  try {
    const pluginNames = await getPlugins();

    for (const pluginName of pluginNames) {
      const plugin = await getPlugin(pluginName);

      if (!plugin?.config?.meta?.afterProcess) {
        continue;
      }

      const { rules = [] } = plugin.config.meta.afterProcess || {};

      const props: ProcessHandlerProps = {
        subdomain,
        pluginName,
        rules,
        payload,
        action,
      };

      if (source === 'mongo') {
        if (action === 'update') {
          handleUpdatedDocument({ ...props, contentType });
          continue;
        }
        if (action === 'create') {
          handleCreateDocument({ ...props, contentType });
          continue;
        }
      }
      if (source === 'graphql') {
        handleAfterMutation(props);
        continue;
      }

      if (source === 'auth') {
        handleAfterAuth(props);
        continue;
      }

      if (source === 'webhook') {
        handleAfterAPIRequest(props);
        continue;
      }
    }
  } catch (error) {
    console.error(
      `Error in handleAfterProcess: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
    throw error;
  }
};
