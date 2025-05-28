import {
  AUTOMATION_EXECUTION_STATUS,
  IAutomationExecAction,
  IAutomationExecutionDocument,
} from 'erxes-api-shared/core-modules';
import { IModels } from '~/connectionResolver';
import { executeActions, getActionsMap } from '../utils';

function accessNestedObject(obj, keys) {
  return keys.reduce((acc, key) => acc && acc[key], obj) || '';
}

export const checkWaitingResponseAction = async (
  models: IModels,
  type: string,
  actionType: string,
  targets: any[],
  executionId: string,
) => {
  try {
    if (actionType) {
      return false;
    }

    let waitingResponseExecutions: IAutomationExecutionDocument[] = [];

    if (executionId) {
      waitingResponseExecutions = await models.Executions.find({
        _id: executionId,
      });
    } else {
      waitingResponseExecutions = await models.Executions.find({
        triggerType: type,
        status: AUTOMATION_EXECUTION_STATUS.WAITING,
        objToCheck: { $exists: true, $ne: null },
        // responseActionId: { $exists: true }
      }).sort({ createdAt: -1 });
    }

    for (const waitingExecution of waitingResponseExecutions) {
      const { objToCheck, actions = [] } = waitingExecution;
      const { general, propertyName } = objToCheck || {};

      const generalKeys = Object.keys(general);
      for (const target of targets) {
        const valueToCheck = accessNestedObject(
          target,
          propertyName.split('.'),
        );

        if (generalKeys.every((key) => target[key] === general[key])) {
          for (const { actionConfig, actionId } of actions) {
            if (
              (actionConfig?.optionalConnects || []).some(
                ({ optionalConnectId }) => optionalConnectId == valueToCheck,
              )
            ) {
              if (waitingExecution.responseActionId !== actionId) {
                waitingExecution.responseActionId = actionId;
              }
              return waitingExecution;
            }
          }
        }
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const doWaitingResponseAction = async (
  models: IModels,
  subdomain: string,
  data,
  waitingExecution: IAutomationExecutionDocument,
) => {
  const { type, targets } = data;

  const clearExecution = (
    exec: IAutomationExecutionDocument,
    status?: string,
  ) => {
    exec.responseActionId = undefined;
    exec.startWaitingDate = undefined;
    // exec.objToCheck = undefined;

    if (status) {
      exec.status = status;
    }

    exec.save().catch((err) => {
      console.error(`Error saving execution: ${err.message}`);
    });
  };

  const { automationId, responseActionId, objToCheck, triggerType } =
    waitingExecution;

  const automation = await models.Automations.findOne({
    _id: automationId,
  })
    .lean()
    .catch((err) => {
      console.error(`Error finding automation: ${err.message}`);
      throw new Error('Automation not found');
    });

  if (!automation) {
    throw new Error('Automation not found');
  }

  const currentAction = automation.actions.find(
    (action) => action.id === responseActionId,
  );

  if (!currentAction) {
    clearExecution(waitingExecution, AUTOMATION_EXECUTION_STATUS.MISSID);
    throw new Error('Automation waiting action not found');
  }

  const { config } = currentAction;

  if (!config?.optionalConnects?.length) {
    clearExecution(waitingExecution, AUTOMATION_EXECUTION_STATUS.ERROR);
    throw new Error('There are no optional connections');
  }

  const optionalConnects = config.optionalConnects;
  const { propertyName, general } = objToCheck;

  for (const target of targets) {
    const generalKeys = Object.keys(general);
    const propertyValue = accessNestedObject(target, propertyName.split('.'));
    const optionalConnection = optionalConnects.find(
      ({ optionalConnectId }) => optionalConnectId === String(propertyValue),
    );
    if (!optionalConnection || !optionalConnection.actionId) {
      continue;
    }

    if (generalKeys.every((key) => target[key] === general[key])) {
      waitingExecution.responseActionId = undefined;
      waitingExecution.startWaitingDate = undefined;
      // waitingExecution.objToCheck = undefined;

      return await executeActions(
        subdomain,
        triggerType,
        waitingExecution,
        await getActionsMap(automation.actions || []),
        optionalConnection.actionId,
      ).catch((err) => {
        console.error(`Error executing actions: ${err.message}`);
        throw err;
      });
    }
  }

  return 'success';
};

export const setActionWait = async (data) => {
  const {
    objToCheck,
    startWaitingDate,
    waitingActionId,
    execution,
    action,
    result,
  } = data;

  const execAction: IAutomationExecAction = {
    actionId: action.id,
    actionType: action.type,
    actionConfig: action.config,
    nextActionId: action.nextActionId,
    result,
  };

  execution.waitingActionId = waitingActionId;
  execution.responseActionId = action.id;

  execution.startWaitingDate = startWaitingDate;

  execution.actions = [...(execution.actions || []), execAction];
  execution.objToCheck = objToCheck;
  execution.status = AUTOMATION_EXECUTION_STATUS.WAITING;
  await execution.save();

  return 'paused';
};
