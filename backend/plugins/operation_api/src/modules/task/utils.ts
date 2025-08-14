import { IModels } from '~/connectionResolvers';
import { ITask, ITaskDocument } from '@/task/@types/task';

const TASK_ACTIVITY_ACTIONS = {
  NAME_CHANGED: 'NAME_CHANGED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  ASSIGNEE_CHANGED: 'ASSIGNEE_CHANGED',
  REMOVED_ASSIGNEE: 'REMOVED_ASSIGNEE',
  PRIORITY_CHANGED: 'PRIORITY_CHANGED',
  ESTIMATE_POINT_CHANGED: 'ESTIMATE_POINT_CHANGED',
  ESTIMATE_POINT_REMOVED: 'ESTIMATE_POINT_REMOVED',
  TEAM_CHANGED: 'TEAM_CHANGED',
  PROJECT_CHANGED: 'PROJECT_CHANGED',
  PROJECT_REMOVED: 'PROJECT_REMOVED',
  START_DATE_CHANGED: 'START_DATE_CHANGED',
  START_DATE_REMOVED: 'START_DATE_REMOVED',
  END_DATE_CHANGED: 'END_DATE_CHANGED',
  END_DATE_REMOVED: 'END_DATE_REMOVED',
} as const;

const TASK_ACTIVITY_MODULES = {
  NAME: 'NAME',
  STATUS: 'STATUS',
  ASSIGNEE: 'ASSIGNEE',
  PRIORITY: 'PRIORITY',
  ESTIMATE_POINT: 'ESTIMATE_POINT',
  TEAM: 'TEAM',
  PROJECT: 'PROJECT',
  START_DATE: 'START_DATE',
  END_DATE: 'END_DATE',
} as const;

type TaskFieldChange = {
  field: keyof ITask;
  module: string;
  defaultValue?: string | number;
  getAction: (newValue: any, oldValue: any) => string | null;
};

export const createTaskActivity = async ({
  models,
  task,
  doc,
  userId,
}: {
  models: IModels;
  task: ITaskDocument;
  doc: ITask;
  userId: string;
}) => {
  const toStr = (val: any) => (val != null ? String(val) : undefined);

  const createActivity = async (
    action: string,
    newValue: any,
    previousValue: any,
    module: string,
  ) => {
    await models.Activity.createActivity({
      contentId: task._id,
      action,
      module,
      metadata: {
        newValue: toStr(newValue),
        previousValue: toStr(previousValue),
      },
      createdBy: userId,
    });
  };

  const fieldChanges: TaskFieldChange[] = [
    {
      field: 'name',
      module: TASK_ACTIVITY_MODULES.NAME,
      getAction: (newValue, oldValue) =>
        newValue !== oldValue ? TASK_ACTIVITY_ACTIONS.NAME_CHANGED : null,
    },
    {
      field: 'status',
      module: TASK_ACTIVITY_MODULES.STATUS,
      getAction: (newValue, oldValue) =>
        newValue !== oldValue ? TASK_ACTIVITY_ACTIONS.STATUS_CHANGED : null,
    },
    {
      field: 'assigneeId',
      module: TASK_ACTIVITY_MODULES.ASSIGNEE,
      getAction: (newValue, oldValue) =>
        newValue !== oldValue
          ? newValue
            ? TASK_ACTIVITY_ACTIONS.ASSIGNEE_CHANGED
            : TASK_ACTIVITY_ACTIONS.REMOVED_ASSIGNEE
          : null,
    },
    {
      field: 'priority',
      module: TASK_ACTIVITY_MODULES.PRIORITY,
      getAction: (newValue, oldValue) =>
        newValue !== oldValue ? TASK_ACTIVITY_ACTIONS.PRIORITY_CHANGED : null,
    },
    {
      field: 'estimatePoint',
      defaultValue: 0,
      module: TASK_ACTIVITY_MODULES.ESTIMATE_POINT,
      getAction: (newValue, oldValue) =>
        newValue !== oldValue
          ? newValue
            ? TASK_ACTIVITY_ACTIONS.ESTIMATE_POINT_CHANGED
            : TASK_ACTIVITY_ACTIONS.ESTIMATE_POINT_REMOVED
          : null,
    },
    {
      field: 'teamId',
      module: TASK_ACTIVITY_MODULES.TEAM,
      getAction: (newValue, oldValue) =>
        newValue !== oldValue ? TASK_ACTIVITY_ACTIONS.TEAM_CHANGED : null,
    },
    {
      field: 'projectId',
      module: TASK_ACTIVITY_MODULES.PROJECT,
      getAction: (newValue, oldValue) =>
        newValue !== oldValue
          ? newValue
            ? TASK_ACTIVITY_ACTIONS.PROJECT_CHANGED
            : TASK_ACTIVITY_ACTIONS.PROJECT_REMOVED
          : null,
    },
    {
      field: 'startDate',
      module: TASK_ACTIVITY_MODULES.START_DATE,
      getAction: (newValue, oldValue) =>
        newValue !== oldValue
          ? newValue
            ? TASK_ACTIVITY_ACTIONS.START_DATE_CHANGED
            : TASK_ACTIVITY_ACTIONS.START_DATE_REMOVED
          : null,
    },
    {
      field: 'targetDate',
      module: TASK_ACTIVITY_MODULES.END_DATE,
      getAction: (newValue, oldValue) =>
        newValue !== oldValue
          ? newValue
            ? TASK_ACTIVITY_ACTIONS.END_DATE_CHANGED
            : TASK_ACTIVITY_ACTIONS.END_DATE_REMOVED
          : null,
    },
  ];

  for (const { field, module, getAction, defaultValue } of fieldChanges) {
    const newValue = doc[field];
    const oldValue = task[field];

    if (oldValue !== defaultValue && newValue && newValue !== oldValue) {
      const action = getAction(newValue, oldValue);

      if (action) {
        await createActivity(action, newValue, oldValue, module);
      }
    }
  }
};
