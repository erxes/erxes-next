import { checkPermission, moduleRequireLogin } from "erxes-api-shared/core-modules/permissions/utils";
import { IListParams } from "erxes-api-shared/core-types";
import { sendTRPCMessage } from "erxes-api-shared/utils/trpc";
import { IContext, IModels } from "~/connectionResolvers";
import { generateTaskCommonFilters, getItemList } from '~/modules/tasks/utils';
import { IArchiveArgs } from '~/modules/tasks/utils';
import { checkItemPermByUser } from '~/modules/tasks/utils';
import { archivedItems, archivedItemsCount  } from '~/modules/tasks/utils';

interface ITasksAsLogsParams {
  contentId: string;
  contentType: string;
  limit?: number;
}

const taskQueries = {
  /**
   * Tasks list
   */
  async tasks(_root, args: IListParams, { user, models, subdomain }: IContext) {
    const filter = {
      ...(await generateTaskCommonFilters(models, subdomain, user._id, args))
    };

    return await getItemList(models, filter, args, user, 'task');
  },

  async tasksTotalCount(
    _root,
    args: IListParams,
    { user, models, subdomain }: IContext
  ) {
    const filter = {
      ...(await generateTaskCommonFilters(models, subdomain, user._id, args))
    };

    return models.Tasks.find(filter).countDocuments();
  },

  /**
   * Archived list
   */
  async archivedTasks(_root, args: IArchiveArgs, { models }: IContext) {
    return archivedItems(models, args, models.Tasks);
  },

  async archivedTasksCount(_root, args: IArchiveArgs, { models }: IContext) {
    return archivedItemsCount(models, args, models.Tasks);
  },

  /**
   * Tasks detail
   */
  async taskDetail(
    _root,
    { _id, clientPortalCard }: { _id: string; clientPortalCard: boolean },
    { user, models }: IContext
  ) {
    const task = await models.Tasks.getTask(_id);

    // no need to check permission on cp task
    if (clientPortalCard) {
      return task;
    }

    return checkItemPermByUser(models, user, task);
  },

  async tasksAsLogs(
    _root,
    { contentId, contentType, limit }: ITasksAsLogsParams,
    { models: { Tasks } }: IContext
  ) {
    let tasks: any[] = [];

    // Define required parameters for TRPC call
    const pluginName = 'contacts';
    const method = 'query';
    const module = 'conformities';
    const defaultValue: string[] = [];
    const options = {};

    const relatedTaskIds = await sendTRPCMessage({
      pluginName, 
      method, 
      module,
      action: 'conformities.savedConformity',
      input: {
        mainType: contentType,
        mainTypeId: contentId,
        relTypes: ['task']
      },
      defaultValue, 
      options
    });

    if (contentType !== 'tasks:task') {
      const query = Tasks.find({
        $and: [
          { _id: { $in: relatedTaskIds } },
          { status: { $ne: 'archived' } }
        ]
      }).sort({ closeDate: 1 });

      if (limit) {
        query.limit(limit);
      }

      tasks = await query.lean();
    }

    return tasks;
  }
};

moduleRequireLogin(taskQueries);
checkPermission(taskQueries, 'tasks', 'showTasks', []);

export default taskQueries;