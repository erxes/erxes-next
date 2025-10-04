import { setWaitActionResponse } from '@/executions/setWaitActionResponse';
import {
  IAutomationAction,
  IAutomationExecutionDocument,
  splitType,
} from 'erxes-api-shared/core-modules';
import { sendWorkerMessage } from 'erxes-api-shared/utils';

type TCreateActionResponse = Promise<{
  shouldBreak: boolean;
  actionResponse: any;
}>;

export const executeCreateAction = async (
  subdomain: string,
  execution: IAutomationExecutionDocument,
  action: IAutomationAction,
): TCreateActionResponse => {
  const [pluginName, moduleName, collectionType, actionType] = splitType(
    action.type,
  );

  const actionResponse = await sendWorkerMessage({
    subdomain,
    pluginName,
    queueName: 'automations',
    jobName: 'receiveActions',
    data: {
      moduleName,
      actionType,
      action,
      execution,
      collectionType,
    },
  });

  const waitCondition = actionResponse?.waitCondition;
  let shouldBreak = false;

  if (waitCondition) {
    return await setWaitActionResponse(
      subdomain,
      execution,
      action,
      waitCondition,
    );
  }
  if (actionResponse.error) {
    throw new Error(actionResponse.error);
  }

  return { shouldBreak, actionResponse };
};
