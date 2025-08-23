import type { IModels } from '~/connectionResolvers';
import type { ITask, ITaskDocument } from '@/task/@types/task';
import { subMinutes, isAfter } from 'date-fns';

const ACTIONS = {
  CREATED: 'CREATED',
  CHANGED: 'CHANGED',
  REMOVED: 'REMOVED',
} as const;

const MODULES = {
  NAME: 'NAME',
  STATUS: 'STATUS',
  ASSIGNEE: 'ASSIGNEE',
  PRIORITY: 'PRIORITY',
  TEAM: 'TEAM',
  START_DATE: 'START_DATE',
  END_DATE: 'END_DATE',
  ESTIMATE_POINT: 'ESTIMATE_POINT',
} as const;

const getModule = (field: string) => {
  const module = MODULES[field.toUpperCase() as keyof typeof MODULES];

  if (module) return module;

  switch (field) {
    case 'assigneeId':
      return MODULES.ASSIGNEE;
    case 'teamId':
      return MODULES.TEAM;
    case 'startDate':
      return MODULES.START_DATE;
    case 'targetDate':
      return MODULES.END_DATE;
    case 'estimatePoint':
      return MODULES.ESTIMATE_POINT;
    default:
      return null;
  }
};

export const createTaskActivity = async ({
  models,
  task,
  doc,
  userId,
}: {
  models: IModels;
  task: ITaskDocument;
  doc: Partial<ITask>;
  userId: string;
}) => {
  const toStr = (val: any) => (val != null ? String(val) : undefined);

  const logActivity = async (
    action: string,
    newValue: any,
    previousValue: any,
    module: string,
  ) => {
    const lastActivity = await models.Activity.findOne({
      contentId: task._id,
    }).sort({ createdAt: -1 });

    if (lastActivity?.module === module && lastActivity?.action === action) {
      // 30 минутын өмнө
      const thirtyMinutesAgo = subMinutes(new Date(), 30);

      // lastActivity.createdAt нь 30 минутаас залуу эсэх
      const isBefore30Min = isAfter(
        new Date(lastActivity.createdAt),
        thirtyMinutesAgo,
      );

      if (isBefore30Min && newValue === lastActivity.metadata.previousValue) {
        return models.Activity.deleteOne({ _id: lastActivity._id });
      }

      return models.Activity.updateActivity({
        _id: lastActivity._id,
        contentId: task._id,
        action,
        module,
        metadata: {
          newValue: toStr(newValue),
          previousValue: toStr(lastActivity.metadata.previousValue),
        },
        createdBy: userId,
      });
    } else {
      const activity = await models.Activity.createActivity({
        contentId: task._id,
        action,
        module,
        metadata: {
          newValue: toStr(newValue),
          previousValue: toStr(previousValue),
        },
        createdBy: userId,
      });

      return activity;
    }
  };

  for (const field in doc) {
    const newValue = doc[field as keyof ITask];
    const oldValue = task[field as keyof ITask];

    const module = getModule(field);

    if (!module) continue;

    let action: string | null = null;

    if (['startDate', 'targetDate', 'estimatePoint'].includes(field)) {
      action =
        !oldValue && newValue
          ? ACTIONS.CREATED
          : newValue !== oldValue
          ? newValue
            ? ACTIONS.CHANGED
            : ACTIONS.REMOVED
          : null;
    } else {
      // Бусад бүх талбарын хувьд
      action = newValue !== oldValue ? ACTIONS.CHANGED : null;
    }

    if (action) await logActivity(action, newValue, oldValue, module);
  }
};
