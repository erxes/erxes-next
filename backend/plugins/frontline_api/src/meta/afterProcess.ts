import { splitType } from 'erxes-api-shared/core-modules';
import { AfterProcessConfigs } from 'erxes-api-shared/utils';
import { generateModels } from '~/connectionResolvers';
import { facebookAfterProcessWorkers } from '~/modules/integrations/facebook/meta/afterProcess/afterProcessWorkers';

const onDocumentCreatedHandlers = {
  facebook: facebookAfterProcessWorkers.onDocumentCreated,
};

export const afterProcess = {
  rules: [...facebookAfterProcessWorkers.rules],
  onDocumentCreated: async ({ subdomain }, data) => {
    const models = await generateModels(subdomain);
    const { contentType } = data || {};
    const [_, moduleName, collectionType] = splitType(contentType);

    const handler = onDocumentCreatedHandlers[moduleName];

    await handler(models, collectionType, data);
  },
} as AfterProcessConfigs;
