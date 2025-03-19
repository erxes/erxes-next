import { IContext } from 'backend/core-api/src/connectionResolvers';
export interface IListArgs {
  contentType: string;
  contentId: string;
  activityType: string;
}

interface IListArgsByAction {
  contentType: string;
  action: string;
  pipelineId: string;
  perPage?: number;
  page?: number;
}

export const activityLogQueries = {
  /**
   * Get activity log list
   */
  async activityLogs(_root, doc: IListArgs, { models, subdomain }: IContext) {
    const { contentId, contentType, activityType } = doc;

    const activities: any[] = [];

    if (activityType && activityType !== 'activity') {
      const serviceName = activityType.split(':')[0];
    }

    const activityLogs = await models.ActivityLogs.find({
      contentId,
    }).lean();

    activities.push(...activityLogs);

    activities.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return activities;
  },

  async activityLogsByAction(
    _root,
    {
      contentType,
      action,
      pipelineId,
      perPage = 10,
      page = 1,
    }: IListArgsByAction,
    { models, subdomain }: IContext,
  ) {
    const allActivityLogs: any[] = [];

    if (!action) {
      return {
        activityLogs: [],
        totalCount: 0,
      };
    }

    return {
      activityLogs: allActivityLogs,
    };
  },
};

export default activityLogQueries;
