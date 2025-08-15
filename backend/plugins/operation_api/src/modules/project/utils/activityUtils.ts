import type { IModels } from '~/connectionResolvers';
import type { IProject, IProjectDocument } from '@/project/@types/project';

const ACTIONS = {
  CREATED: 'CREATED',
  CHANGED: 'CHANGED',
  REMOVED: 'REMOVED',
} as const;

const MODULES = {
  NAME: 'NAME',
  STATUS: 'STATUS',
  LEAD: 'LEAD',
  PRIORITY: 'PRIORITY',
  TEAM: 'TEAM',
  START_DATE: 'START_DATE',
  END_DATE: 'END_DATE',
} as const;

const getModule = (field: string) => {
  const module = MODULES[field.toUpperCase() as keyof typeof MODULES];

  if (module) return module;

  switch (field) {
    case 'leadId':
      return MODULES.LEAD;
    case 'teamIds':
      return MODULES.TEAM;
    case 'startDate':
      return MODULES.START_DATE;
    case 'targetDate':
      return MODULES.END_DATE;
    default:
      return null;
  }
};

export const createProjectActivity = async ({
  models,
  project,
  doc,
  userId,
}: {
  models: IModels;
  project: IProjectDocument;
  doc: Partial<IProject>;
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
      contentId: project._id,
    }).sort({ createdAt: -1 });

    if (lastActivity?.module === module && lastActivity?.action === action) {
      return models.Activity.updateOne(
        {
          _id: lastActivity._id,
        },
        {
          $set: {
            contentId: project._id,
            action,
            module,
            metadata: {
              newValue: toStr(newValue),
              previousValue: toStr(previousValue),
            },
            createdBy: userId,
          },
        },
      );
    }

    return models.Activity.createActivity({
      contentId: project._id,
      action,
      module,
      metadata: {
        newValue: toStr(newValue),
        previousValue: toStr(previousValue),
      },
      createdBy: userId,
    });
  };

  for (const field in doc) {
    const newValue = doc[field as keyof IProject];
    const oldValue = project[field as keyof IProject];

    const module = getModule(field);

    if (!module) continue;

    let action: string | null = null;

    if (field === 'teamIds') {
      return;
    } else if (['startDate', 'targetDate'].includes(field)) {
      action =
        !oldValue && newValue
          ? ACTIONS.CREATED
          : newValue !== oldValue
          ? newValue
            ? ACTIONS.CHANGED
            : ACTIONS.REMOVED
          : null;
    } else {
      action = newValue !== oldValue ? ACTIONS.CHANGED : null;
    }

    if (action) await logActivity(action, newValue, oldValue, module);
  }
};
