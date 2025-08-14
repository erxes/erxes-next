import { IModels } from '~/connectionResolvers';
import { IProject, IProjectDocument } from '@/project/@types/project';

const PROJECT_ACTIVITY_ACTIONS = {
  NAME_CHANGED: 'NAME_CHANGED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  LEAD_CHANGED: 'LEAD_CHANGED',
  LEAD_REMOVED: 'LEAD_REMOVED',
  PRIORITY_CHANGED: 'PRIORITY_CHANGED',
  TEAM_CHANGED: 'TEAM_CHANGED',
  START_DATE_CHANGED: 'START_DATE_CHANGED',
  START_DATE_REMOVED: 'START_DATE_REMOVED',
  END_DATE_CHANGED: 'END_DATE_CHANGED',
  END_DATE_REMOVED: 'END_DATE_REMOVED',
} as const;

const PROJECT_ACTIVITY_MODULES = {
  NAME: 'NAME',
  STATUS: 'STATUS',
  LEAD: 'LEAD',
  PRIORITY: 'PRIORITY',
  TEAM: 'TEAM',
  START_DATE: 'START_DATE',
  END_DATE: 'END_DATE',
} as const;

type ProjectFieldChange = {
  field: keyof IProject;
  module: string;
  defaultValue?: string | number;
  getAction: (newValue: any, oldValue: any) => string | null;
};

export const createProjectActivity = async ({
  models,
  project,
  doc,
  userId,
}: {
  models: IModels;
  project: IProjectDocument;
  doc: IProject;
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

  const fieldChanges: ProjectFieldChange[] = [
    {
      field: 'name',
      module: PROJECT_ACTIVITY_MODULES.NAME,
      getAction: (newValue, oldValue) =>
        newValue !== oldValue ? PROJECT_ACTIVITY_ACTIONS.NAME_CHANGED : null,
    },
    {
      field: 'status',
      module: PROJECT_ACTIVITY_MODULES.STATUS,
      getAction: (newValue, oldValue) =>
        newValue !== oldValue ? PROJECT_ACTIVITY_ACTIONS.STATUS_CHANGED : null,
    },
    {
      field: 'leadId',
      module: PROJECT_ACTIVITY_MODULES.LEAD,
      getAction: (newValue, oldValue) =>
        newValue !== oldValue
          ? newValue
            ? PROJECT_ACTIVITY_ACTIONS.LEAD_CHANGED
            : PROJECT_ACTIVITY_ACTIONS.LEAD_REMOVED
          : null,
    },
    {
      field: 'priority',
      module: PROJECT_ACTIVITY_MODULES.PRIORITY,
      getAction: (newValue, oldValue) =>
        newValue !== oldValue
          ? PROJECT_ACTIVITY_ACTIONS.PRIORITY_CHANGED
          : null,
    },
    {
      field: 'teamIds',
      module: PROJECT_ACTIVITY_MODULES.TEAM,
      getAction: (newValue: string[] = [], oldValue: string[] = []) => {
        // Массив байгаа эсэхийг шалгах
        if (!Array.isArray(newValue) || !Array.isArray(oldValue)) return null;

        // Урт нь өөр бол шууд өөрчлөгдсөн гэж үзнэ
        if (newValue.length !== oldValue.length) {
          return PROJECT_ACTIVITY_ACTIONS.TEAM_CHANGED;
        }

        // Агуулга өөр эсэхийг шалгах
        const changed =
          newValue.some((id) => !oldValue.includes(id)) ||
          oldValue.some((id) => !newValue.includes(id));

        return changed ? PROJECT_ACTIVITY_ACTIONS.TEAM_CHANGED : null;
      },
    },

    {
      field: 'startDate',
      module: PROJECT_ACTIVITY_MODULES.START_DATE,
      getAction: (newValue, oldValue) =>
        newValue !== oldValue
          ? newValue
            ? PROJECT_ACTIVITY_ACTIONS.START_DATE_CHANGED
            : PROJECT_ACTIVITY_ACTIONS.START_DATE_REMOVED
          : null,
    },
    {
      field: 'targetDate',
      module: PROJECT_ACTIVITY_MODULES.END_DATE,
      getAction: (newValue, oldValue) =>
        newValue !== oldValue
          ? newValue
            ? PROJECT_ACTIVITY_ACTIONS.END_DATE_CHANGED
            : PROJECT_ACTIVITY_ACTIONS.END_DATE_REMOVED
          : null,
    },
  ];

  for (const { field, module, getAction, defaultValue } of fieldChanges) {
    const newValue = doc[field];
    const oldValue = project[field];

    if (oldValue !== defaultValue && newValue && newValue !== oldValue) {
      const action = getAction(newValue, oldValue);

      if (action) {
        await createActivity(action, newValue, oldValue, module);
      }
    }
  }
};
