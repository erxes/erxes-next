import {
  AUTOMATION_EXECUTION_STATUS,
  IAction,
  IActionsMap,
  IAutomationExecAction,
  IAutomationExecutionDocument,
  ITrigger,
  splitType,
  TriggerType,
} from 'erxes-api-shared/core-modules';
import { sendWorkerMessage, sendWorkerQueue } from 'erxes-api-shared/utils';
import { IModels } from '~/connectionResolver';
import { ACTIONS } from '~/constants';
import { handleEmail } from './actions/email';
import { setActionWait } from './actions/wait';
import { isInSegment } from './segments/utils';
import moment from 'moment';

export const getActionsMap = async (actions: IAction[]) => {
  const actionsMap: IActionsMap = {};

  for (const action of actions) {
    actionsMap[action.id] = action;
  }

  return actionsMap;
};

const isDiffValue = (latest, target, field) => {
  if (field.includes('customFieldsData') || field.includes('trackedData')) {
    const [ct, fieldId] = field.split('.');
    const latestFoundItem = latest[ct].find((i) => i.field === fieldId);
    const targetFoundItem = target[ct].find((i) => i.field === fieldId);

    // previously empty and now receiving new value
    if (!latestFoundItem && targetFoundItem) {
      return true;
    }

    if (latestFoundItem && targetFoundItem) {
      return latestFoundItem.value !== targetFoundItem.value;
    }

    return false;
  }

  const getValue = (obj, attr) => {
    try {
      return obj[attr];
    } catch (e) {
      return undefined;
    }
  };

  const extractFields = field.split('.');

  let latestValue = latest;
  let targetValue = target;

  for (const f of extractFields) {
    latestValue = getValue(latestValue, f);
    targetValue = getValue(targetValue, f);
  }

  if (targetValue !== latestValue) {
    return true;
  }

  return false;
};

export const executeActions = async (
  subdomain: string,
  triggerType: string,
  execution: IAutomationExecutionDocument,
  actionsMap: IActionsMap,
  currentActionId?: string,
): Promise<string | null | undefined> => {
  if (!currentActionId) {
    execution.status = AUTOMATION_EXECUTION_STATUS.COMPLETE;
    await execution.save();

    return 'finished';
  }

  const action = actionsMap[currentActionId];
  if (!action) {
    execution.status = AUTOMATION_EXECUTION_STATUS.MISSID;
    await execution.save();

    return 'missed action';
  }

  execution.status = AUTOMATION_EXECUTION_STATUS.ACTIVE;

  const execAction: IAutomationExecAction = {
    actionId: currentActionId,
    actionType: action.type,
    actionConfig: action.config,
    nextActionId: action.nextActionId,
  };

  let actionResponse: any = null;

  try {
    if (action.type === ACTIONS.WAIT) {
      execution.waitingActionId = action.id;
      execution.startWaitingDate = new Date();
      execution.status = AUTOMATION_EXECUTION_STATUS.WAITING;
      execution.actions = [...(execution.actions || []), execAction];

      const { value, type } = action?.config || {};

      const performDate = moment(execution.startWaitingDate)
        .add(value, type)
        .toDate();

      // Calculate delay in milliseconds

      const delay = Math.max(0, performDate.getTime() - Date.now());
      sendWorkerQueue('automations', 'playWait').add(
        'playWait',
        {
          subdomain,
          data: {
            automationId: execution.automationId,
            waitingActionId: action.id,
            execId: execution._id,
          },
        },
        {
          delay: delay,
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
      await execution.save();
      return 'paused';
    }

    if (action.type === ACTIONS.IF) {
      let ifActionId;

      const isIn = await isInSegment(
        action.config.contentId,
        execution.targetId,
      );
      if (isIn) {
        ifActionId = action.config.yes;
      } else {
        ifActionId = action.config.no;
      }

      execAction.nextActionId = ifActionId;
      execAction.result = { condition: isIn };
      execution.actions = [...(execution.actions || []), execAction];
      execution = await execution.save();

      return executeActions(
        subdomain,
        triggerType,
        execution,
        actionsMap,
        ifActionId,
      );
    }

    if (action.type === ACTIONS.SET_PROPERTY) {
      const { module } = action.config;
      const [pluginName, collectionType] = splitType(module);

      actionResponse = await sendWorkerMessage({
        subdomain,
        pluginName,
        queueName: 'automations',
        jobName: 'receiveActions',
        data: {
          triggerType,
          actionType: 'set-property',
          action,
          execution,
          collectionType,
        },
      });
    }

    if (action.type === ACTIONS.SEND_EMAIL) {
      try {
        actionResponse = await handleEmail({
          subdomain,
          target: execution.target,
          triggerType,
          config: action.config,
          execution,
        });
      } catch (err) {
        actionResponse = err.message;
      }
    }

    if (action.type.includes('create')) {
      const [pluginName, type] = splitType(action.type);

      actionResponse = await sendWorkerMessage({
        subdomain,
        pluginName,
        queueName: 'automations',
        jobName: 'receiveActions',
        data: {
          actionType: 'create',
          action,
          execution,
          collectionType: type.replace('.create', ''),
        },
      });

      if (actionResponse?.objToWait) {
        setActionWait({
          ...actionResponse.objToWait,
          execution,
          action,
          result: actionResponse?.result,
        });

        return 'paused';
      }

      if (actionResponse.error) {
        throw new Error(actionResponse.error);
      }
    }
  } catch (e) {
    execAction.result = { error: e.message, result: e.result };
    execution.actions = [...(execution.actions || []), execAction];
    execution.status = AUTOMATION_EXECUTION_STATUS.ERROR;
    execution.description = `An error occurred while working action: ${action.type}`;
    await execution.save();
    return;
  }

  execAction.result = actionResponse;
  execution.actions = [...(execution.actions || []), execAction];
  execution = await execution.save();

  return executeActions(
    subdomain,
    triggerType,
    execution,
    actionsMap,
    action.nextActionId,
  );
};

const isWaitingDateConfig = (dateConfig) => {
  if (dateConfig) {
    const NOW = new Date();

    if (dateConfig.type === 'range') {
      const { startDate, endDate } = dateConfig;
      if (startDate < NOW && endDate > NOW) {
        return true;
      }
    }

    if (dateConfig?.type === 'cycle') {
      const { frequencyType } = dateConfig;

      const generateDate = (inputDate, isMonth?) => {
        const date = new Date(inputDate);

        return new Date(
          NOW.getFullYear(),
          isMonth ? NOW.getMonth() : date.getMonth(),
          date.getDay(),
        );
      };

      if (frequencyType === 'everyYear') {
        const startDate = generateDate(dateConfig.startDate);
        if (dateConfig?.endDate) {
          const endDate = generateDate(dateConfig.endDate);

          if (NOW < startDate && NOW > endDate) {
            return true;
          }
        }
        if (NOW < startDate) {
          return true;
        }
      }
      if (frequencyType === 'everyMonth') {
        const startDate = generateDate(dateConfig.startDate, true);
        if (dateConfig?.endDate) {
          const endDate = generateDate(dateConfig.endDate, true);

          if (NOW < startDate && NOW > endDate) {
            return true;
          }
        }
        if (NOW < startDate) {
          return true;
        }
      }
    }
  }
  return false;
};

export const calculateExecution = async ({
  models,
  subdomain,
  automationId,
  trigger,
  target,
}: {
  models: IModels;
  subdomain: string;
  automationId: string;
  trigger: ITrigger;
  target: any;
}): Promise<IAutomationExecutionDocument | null | undefined> => {
  const { id, type, config, isCustom } = trigger;
  const { reEnrollment, reEnrollmentRules, contentId } = config || {};

  try {
    if (!!isCustom) {
      const [pluginName, collectionType] = splitType(trigger?.type || '');

      const isValid = await sendWorkerMessage({
        subdomain,
        pluginName,
        queueName: 'automations',
        jobName: 'checkCustomTrigger',
        data: {
          collectionType,
          automationId,
          trigger,
          target,
          config,
        },
        defaultValue: false,
      });
      if (!isValid) {
        return;
      }
    } else if (!(await isInSegment(contentId, target._id))) {
      return;
    }
  } catch (e) {
    await models.Executions.create({
      automationId,
      triggerId: id,
      triggerType: type,
      triggerConfig: config,
      targetId: target._id,
      target,
      status: AUTOMATION_EXECUTION_STATUS.ERROR,
      description: `An error occurred while checking the is in segment: "${e.message}"`,
      createdAt: new Date(),
    });
    return;
  }

  const executions = await models.Executions.find({
    automationId,
    triggerId: id,
    targetId: target._id,
    status: { $ne: AUTOMATION_EXECUTION_STATUS.ERROR },
  })
    .sort({ createdAt: -1 })
    .limit(1)
    .lean();

  const latestExecution: IAutomationExecutionDocument | null = executions.length
    ? executions[0]
    : null;

  // if (latestExecution) {
  //   if (!reEnrollment || !reEnrollmentRules.length) {
  //     return;
  //   }

  //   let isChanged = false;

  //   for (const reEnrollmentRule of reEnrollmentRules) {
  //     if (isDiffValue(latestExecution.target, target, reEnrollmentRule)) {
  //       isChanged = true;
  //       break;
  //     }
  //   }

  //   if (!isChanged) {
  //     return;
  //   }
  // }

  return models.Executions.create({
    automationId,
    triggerId: id,
    triggerType: type,
    triggerConfig: config,
    targetId: target._id,
    target,
    status: AUTOMATION_EXECUTION_STATUS.ACTIVE,
    description: `Met enrollment criteria`,
    createdAt: new Date(),
  });
};

export const receiveTrigger = async ({
  models,
  subdomain,
  type,
  targets,
}: {
  models: IModels;
  subdomain: string;
  type: string;
  targets: any[];
}) => {
  const automations = await models.Automations.find({
    status: 'active',
    $or: [
      {
        'triggers.type': { $in: [type] },
      },
      {
        'triggers.type': { $regex: `^${type}\\..*` },
      },
    ],
  }).lean();

  if (!automations.length) {
    return;
  }

  for (const target of targets) {
    for (const automation of automations) {
      for (const trigger of automation.triggers) {
        if (!trigger.type.includes(type)) {
          continue;
        }

        if (isWaitingDateConfig(trigger?.config?.dateConfig)) {
          continue;
        }

        const execution = await calculateExecution({
          models,
          subdomain,
          automationId: automation._id,
          trigger,
          target,
        });

        if (execution) {
          await executeActions(
            subdomain,
            trigger.type,
            execution,
            await getActionsMap(automation.actions),
            trigger.actionId,
          );
        }
      }
    }
  }
};
