import type { Job } from 'bullmq';
import { AUTOMATION_EXECUTION_STATUS } from 'erxes-api-shared/core-modules';
import { createMQWorkerWithListeners } from 'erxes-api-shared/utils';
import { generateModels } from '~/connectionResolver';
import {
  checkWaitingResponseAction,
  doWaitingResponseAction,
} from '~/utils/actions/wait';
import { executeActions, getActionsMap, receiveTrigger } from '~/utils/utils';

type ICommonJobData = {
  subdomain: string;
};

// Reusable shape for job data
interface IJobData<TData> extends ICommonJobData {
  data: TData;
}

// Type for trigger job data
interface ITriggerData {
  type: string;
  actionType: string;
  targets: unknown[]; // Replace with actual type if known
  executionId: string;
}

// Type for play wait job data
interface IPlayWaitData {
  automationId: string;
  waitingActionId: string;
  execId: string;
}

// Final job interfaces
type ITriggerJobData = IJobData<ITriggerData>;
type IPlayWaitJobData = IJobData<IPlayWaitData>;

const triggerHandlerWorker = async (job: Job<ITriggerJobData>) => {
  const { subdomain, data } = job?.data ?? {};
  const models = await generateModels(subdomain);
  console.info('Initialized databases');

  console.info(`Recieved data from:${JSON.stringify({ subdomain, data })}`);

  const { type, actionType, targets, executionId } = data;
  try {
    const waitingExecution = await checkWaitingResponseAction(
      models,
      type,
      actionType,
      targets,
      executionId,
    );

    if (waitingExecution) {
      await doWaitingResponseAction(models, subdomain, data, waitingExecution);
      return;
    }

    await receiveTrigger({ models, subdomain, type, targets });
  } catch (error: any) {
    console.error(`Error processing job ${job.id}: ${error.message}`);
    throw error;
  }
};

const playWaitingActionWorker = async (job: Job<IPlayWaitJobData>) => {
  const { subdomain, data, ...fuckers } = job.data;

  const models = await generateModels(subdomain);

  const { automationId, waitingActionId, execId } = data;
  const execution = await models.Executions.findOne({ _id: execId });

  if (!execution) {
    console.info(
      `Not found execution ${execId} with action ${waitingActionId} for start action`,
    );
    return;
  }

  const automation = await models.Automations.findOne({
    _id: automationId,
    'actions.id': waitingActionId,
  }).lean();

  if (!automation) {
    models.Executions.updateOne({
      _id: execution.id,
      status: AUTOMATION_EXECUTION_STATUS.MISSID,
      description: 'Not found automation of execution',
    });
    console.info(
      `Not found automation ${automationId} with action ${waitingActionId} for start action`,
    );
    return;
  }

  try {
    const { actions = [] } = automation;

    const action = actions.find(({ id }) => id === waitingActionId);

    executeActions(
      subdomain,
      execution.triggerType,
      execution,
      await getActionsMap(automation.actions || []),
      action?.nextActionId,
    );
  } catch (error) {
    models.Executions.updateOne({
      _id: execution.id,
      status: AUTOMATION_EXECUTION_STATUS.ERROR,
      description: error.message,
    });
  }
};

const generateMQWorker = (
  redis: any,
  resolve: (value: void | PromiseLike<void>) => void,
  queueName: string,
  resolver: (job: Job) => Promise<any>,
) =>
  createMQWorkerWithListeners('automations', queueName, resolver, redis, () => {
    resolve();
  });

export const initMQWorkers = async (redis: any) => {
  console.info('Starting worker ...');

  return new Promise<void>((resolve, reject) => {
    try {
      generateMQWorker(redis, resolve, 'trigger', triggerHandlerWorker);
      generateMQWorker(redis, resolve, 'playWait', playWaitingActionWorker);
    } catch (error) {
      reject(error);
    }
  });
};
