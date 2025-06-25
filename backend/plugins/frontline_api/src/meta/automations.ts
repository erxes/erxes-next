import { AutomationConfigs } from 'erxes-api-shared/core-modules/automations/types';
import { generateModels } from '~/connectionResolvers';
import { facebookConstants } from '@/integrations/facebook/meta/automation/constants';
import { facebookAutomationWorkers } from '@/integrations/facebook/meta/automation/workers';

const modules = {
  facebook: facebookAutomationWorkers,
};

type ModuleKeys = keyof typeof modules;

export default {
  constants: {
    actions: [...facebookConstants.actions],
    triggers: [...facebookConstants.triggers],
    bots: [...facebookConstants.bots],
  },
  receiveActions: async ({ subdomain }, { data: { moduleName, ...args } }) => {
    const models = await generateModels(subdomain);
    const context = { models, subdomain };

    return modules[moduleName as ModuleKeys].receiveActions(context, {
      ...args,
    });
  },
  checkCustomTrigger: async (
    { subdomain },
    { data: { moduleName, ...props } },
  ) => {
    const models = await generateModels(subdomain);
    const context = { models, subdomain };

    return modules[moduleName as ModuleKeys].checkCustomTrigger(context, {
      ...props,
    });
  },
} as AutomationConfigs;
