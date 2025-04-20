// import {
//     replacePlaceHolders,
//     setProperty
//   } from "@erxes/api-utils/src/automations";
//   import { generateModels, IModels } from "./connectionResolver";
//   import { sendCommonMessage } from "./messageBroker";

import {
  replacePlaceHolders,
  setProperty,
  startAutomations,
} from 'erxes-api-shared/core-modules';
import { generateModels, IModels } from './connectionResolvers';

const getRelatedValue = async (
  models: IModels,
  subdomain: string,
  target,
  targetKey,
) => {
  return false;
};

const getItems = async (
  subdomain: string,
  module: string,
  execution: any,
  triggerType: string,
) => {
  const { target } = execution;

  if (module === triggerType) {
    return [target];
  }

  const models = await generateModels(subdomain);

  let model: any = models.Customers;

  if (module.includes('company')) {
    model = models.Companies;
  }

  const [moduleService] = module.split(':');
  const [triggerService, triggerContentType] = triggerType.split(':');

  if (
    triggerContentType !== 'form_submission' &&
    moduleService === triggerService
  ) {
    // const relTypeIds = await sendCommonMessage({
    //   subdomain,
    //   serviceName: "core",
    //   action: "conformities.savedConformity",
    //   data: {
    //     mainType: triggerType.split(":")[1],
    //     mainTypeId: target._id,
    //     relTypes: [module.split(":")[1]]
    //   },
    //   isRPC: true
    // });

    return model.find({ _id: { $in: [] } });
  }

  let filter;

  if (triggerContentType === 'form_submission') {
    filter = { _id: target._id };
  } else {
    // send message to trigger service to get related value
    // filter = await sendCommonMessage({
    //   subdomain,
    //   serviceName: triggerService,
    //   action: "getModuleRelation",
    //   data: {
    //     module,
    //     triggerType,
    //     target
    //   },
    //   isRPC: true,
    //   defaultValue: null
    // });
  }

  return filter ? model.find(filter) : [];
};

export default startAutomations('core', {
  receiveActions: async (
    { subdomain },
    { action, execution, triggerType, actionType },
  ) => {
    console.log({ action, execution, triggerType, actionType, subdomain });
    const models = await generateModels(subdomain);

    if (actionType === 'set-property') {
      const { module, rules } = action.config;

      const relatedItems = await getItems(
        subdomain,
        module,
        execution,
        triggerType,
      );

      return setProperty({
        models,
        subdomain,
        getRelatedValue,
        module: module.includes('lead') ? 'core:customer' : module,
        rules,
        execution,
        relatedItems,
        triggerType,
      });
    }
    return 'Hello World Core';
  },
  replacePlaceHolders: async (
    { subdomain },
    { data: { target, config, relatedValueProps } },
  ) => {
    const models = await generateModels(subdomain);

    return await replacePlaceHolders<IModels>({
      models,
      subdomain,
      target,
      actionData: config,
      customResolver: {
        resolver: getRelatedValue,
        props: relatedValueProps,
      },
    });
  },
  getRecipientsEmails: async ({ subdomain }, { data }) => {
    const models = await generateModels(subdomain);
    const { type, config } = data;

    const ids = config[`${type}Ids`];

    const commonFilter = {
      _id: { $in: Array.isArray(ids) ? ids : [ids] },
    };

    if (type === 'user') {
      const result = await models.Users.find(commonFilter).distinct('email');

      return result;
    }

    const CONTACT_TYPES = {
      lead: {
        model: models.Customers,
        filter: { ...commonFilter },
      },
      customer: {
        model: models.Customers,
        filter: {
          ...commonFilter,
        },
      },
      company: {
        model: models.Companies,
        filter: { ...commonFilter },
      },
    };

    const { model, filter } = CONTACT_TYPES[type];

    return await model.find(filter).distinct('primaryEmail');
  },
  constants: {
    triggers: [
      {
        type: 'core:user',
        icon: 'users',
        label: 'Team member',
        description:
          'Start with a blank workflow that enralls and is triggered off team members',
      },
      {
        type: 'core:customer',
        icon: 'users-alt',
        label: 'Customer',
        description:
          'Start with a blank workflow that enrolls and is triggered off Customers',
      },
      {
        type: 'core:lead',
        icon: 'users-alt',
        label: 'Lead',
        description:
          'Start with a blank workflow that enrolls and is triggered off Leads',
      },
      {
        type: 'core:company',
        icon: 'university',
        label: 'Company',
        description:
          'Start with a blank workflow that enrolls and is triggered off company',
      },
      {
        type: 'core:form_submission',
        icon: 'university',
        label: 'Form submission',
        description:
          'Start with a blank workflow that enrolls and is triggered off form submission',
      },
    ],
  },
});
