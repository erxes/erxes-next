import { isEnabled } from 'erxes-api-shared/utils';
import { IModels } from '~/connectionResolvers';
import { fieldsCombinedByContentType } from '~/modules/forms/utils';

export const documents = {
  types: [
    {
      label: 'Customer',
      contentType: 'core:customer',
    },
    {
      label: 'Company',
      contentType: 'core:company',
    },
    {
      label: 'Product',
      contentType: 'core:product',
    },
    {
      label: 'Team member',
      contentType: 'core:user',
    },
  ],
  editorAttributes: async (
    models: IModels,
    subdomain: string,
    contentType: string,
  ) => {
    const [pluginName] = contentType.split(':');

    const isEnabledService = isEnabled(pluginName);

    if (!isEnabledService) {
      return [];
    }

    const fields = await fieldsCombinedByContentType(models, subdomain, {
      contentType,
    });

    return fields.map(({ name, label, groupDetail }) => ({
      value: name,
      name: label,
      groupDetail,
    }));
  },
};
