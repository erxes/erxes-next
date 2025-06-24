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
type IExecutePrevActionJobData = IJobData<{ query: any }>;

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
  const { subdomain, data } = job.data;

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
    await models.Executions.updateOne({
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

const excutePrevActionExecutionWorke = async ({
  data: { subdomain, data },
}: Job<IExecutePrevActionJobData>) => {
  const models = await generateModels(subdomain);
  const { query = {} } = data;

  const lastExecution = await models.Executions.findOne(query).sort({
    createdAt: -1,
  });

  if (!lastExecution) {
    throw new Error('No execution found');
  }

  const { actions = [] } = lastExecution;

  const lastExecutionAction = actions?.at(-1);

  if (!lastExecutionAction) {
    throw new Error(`Execution doesn't execute any actions`);
  }

  const automation = await models.Automations.findOne({
    _id: lastExecution.automationId,
  });

  if (!automation) {
    throw new Error(`No automation found of execution`);
  }

  const prevAction = automation.actions.find((action) => {
    const { nextActionId, config } = action;
    if (nextActionId === lastExecutionAction.actionId) {
      return true;
    }

    const { optionalConnects = [] } = config || {};

    return optionalConnects.find(
      (c) => c.actionId === lastExecutionAction.actionId,
    );
  });

  if (!prevAction) {
    throw new Error('No previous action found for execution');
  }

  await executeActions(
    subdomain,
    lastExecution.triggerType,
    lastExecution,
    await getActionsMap(automation.actions),
    prevAction.id,
  );
};

const generateMQWorker = (
  redis: any,
  queueName: string,
  resolver: (job: Job) => Promise<any>,
): Promise<void> => {
  return new Promise((resolve) => {
    createMQWorkerWithListeners(
      'automations',
      queueName,
      resolver,
      redis,
      () => {
        resolve();
      },
    );
  });
};

export const initMQWorkers = async (redis: any) => {
  console.info('Starting workers...');

  await Promise.all([
    generateMQWorker(redis, 'trigger', triggerHandlerWorker),
    generateMQWorker(redis, 'playWait', playWaitingActionWorker),
    generateMQWorker(
      redis,
      'excutePrevActionExecution',
      excutePrevActionExecutionWorke,
    ),
  ]);

  console.info('All workers initialized');
};
