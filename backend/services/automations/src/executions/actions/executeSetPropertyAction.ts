import {
  IAutomationAction,
  IAutomationExecutionDocument,
  splitType,
  TAutomationProducers,
} from 'erxes-api-shared/core-modules';
import { sendAutomatonMessage } from 'erxes-api-shared/utils';

export const executeSetPropertyAction = async (
  subdomain: string,
  action: IAutomationAction,
  triggerType: string,
  execution: IAutomationExecutionDocument,
) => {
  const { module } = action.config;
  const [pluginName, moduleName, collectionType] = splitType(module);

  return await sendAutomatonMessage({
    pluginName,
    producerName: TAutomationProducers.RECEIVE_ACTIONS,
    input: {
      moduleName,
      triggerType,
      actionType: 'set-property',
      action,
      execution,
      collectionType,
    },
  });
};
