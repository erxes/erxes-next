import { getService, getServices } from 'erxes-api-utils';
import formsQueries from './form';
import submissionQueries from './submission';

export const formQueries = {
  async formsGetContentTypes() {
    const services = await getServices();
    const formTypes: Array<{
      title: string;
      description: string;
      contentType: string;
      icon: string;
    }> = [
      {
        title: 'Lead generation',
        description: 'Generate leads through the form',
        contentType: 'leads',
        icon: 'users-alt',
      },
    ];

    for (const serviceName of services) {
      const service = await getService(serviceName);
      const meta = service.config?.meta || {};

      if (meta?.forms) {
        const { form = undefined } = meta.forms;

        if (form) {
          formTypes.push(form);
        }
      }
    }

    return formTypes;
  },

  ...formsQueries,
  ...submissionQueries,
};
