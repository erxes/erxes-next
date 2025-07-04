import { cursorPaginate, sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import {
  IArchivedTaskQueryParams,
  ITaskQueryParams,
} from '~/modules/tasks/@types/tasks';
import {
  compareDepartmentIds,
  generateArchivedTasksFilter,
  generateFilter,
} from '~/modules/tasks/graphql/resolvers/utils';

export const taskQueries = {
  /**
   * Tasks list
   */
  async tasks(_root, args: ITaskQueryParams, { user, models }: IContext) {
    const filter = await generateFilter(models, user._id, args);

    const { list, pageInfo, totalCount } = await cursorPaginate({
      model: models.Tasks,
      params: args,
      query: filter,
    });

    const companyIds: string[] = [];
    const customerIds: string[] = [];
    const companyIdsByItemId = {};
    const customerIdsByItemId = {};

    const companies = await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'companies',
      action: 'findActiveCompanies',
      input: {
        selector: {
          _id: { $in: [...new Set(companyIds)] },
        },
        fields: {
          primaryName: 1,
          primaryEmail: 1,
          primaryPhone: 1,
          emails: 1,
          phones: 1,
        },
      },
    });

    const customers = await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'customers',
      action: 'findActiveCustomers',
      input: {
        selector: {
          _id: { $in: [...new Set(customerIds)] },
        },
        fields: {
          firstName: 1,
          lastName: 1,
          middleName: 1,
          visitorContactInfo: 1,
          primaryEmail: 1,
          primaryPhone: 1,
          emails: 1,
          phones: 1,
        },
      },
      defaultValue: [],
    });

    const getCocsByItemId = (
      itemId: string,
      cocIdsByItemId: any,
      cocs: any[],
    ) => {
      const cocIds = cocIdsByItemId[itemId] || [];

      return cocIds.flatMap((cocId: string) => {
        const found = cocs.find((coc) => cocId === coc._id);

        return found || [];
      });
    };

    const updatedList: any[] = [];

    // const notifications = await sendNotificationsMessage({
    //   subdomain,
    //   action: 'find',
    //   data: {
    //     selector: {
    //       contentTypeId: { $in: ids },
    //       isRead: false,
    //       receiver: user._id
    //     },
    //     fields: { contentTypeId: 1 }
    //   },
    //   isRPC: true,
    //   defaultValue: []
    // });

    const fields = await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'fields',
      action: 'find',
      input: {
        query: {
          showInCard: true,
          contentType: 'tasks:task',
        },
      },
      defaultValue: [],
    });

    // add just incremented order to each item in list, not from db
    let order = 0;
    for (const item of list as any) {
      if (
        item.customFieldsData &&
        item.customFieldsData.length > 0 &&
        fields.length > 0
      ) {
        item.customProperties = [];

        fields.forEach((field) => {
          const fieldData = item.customFieldsData.find(
            (f) => f.field === field._id,
          );

          if (fieldData) {
            item.customProperties.push({
              name: `${field.text} - ${fieldData.value}`,
            });
          }
        });
      }

      // const notification = notifications.find(n => n.contentTypeId === item._id);

      updatedList.push({
        ...item,
        order: order++,
        isWatched: (item.watchedUserIds || []).includes(user._id),
        // hasNotified: notification ? false : true,
        customers: getCocsByItemId(item._id, customerIdsByItemId, customers),
        companies: getCocsByItemId(item._id, companyIdsByItemId, companies),
      });
    }

    return { list: updatedList, pageInfo, totalCount };
  },

  async tasksTotalCount(
    _root,
    args: ITaskQueryParams,
    { user, models }: IContext,
  ) {
    const filter = await generateFilter(models, user._id, args);

    return models.Tasks.find(filter).countDocuments();
  },

  /**
   * Archived list
   */
  async archivedTasks(
    _root,
    args: IArchivedTaskQueryParams,
    { models }: IContext,
  ) {
    const { pipelineId } = args;

    const stages = await models.Stages.find({ pipelineId }).lean();

    if (stages.length > 0) {
      const filter = generateArchivedTasksFilter(args, stages);

      const { list, pageInfo, totalCount } = await cursorPaginate({
        model: models.Tasks,
        params: args,
        query: filter,
      });

      return { list, pageInfo, totalCount };
    }

    return [];
  },

  async archivedTasksCount(
    _root,
    args: IArchivedTaskQueryParams,
    { models }: IContext,
  ) {
    const { pipelineId } = args;

    const stages = await models.Stages.find({ pipelineId });

    if (stages.length > 0) {
      const filter = generateArchivedTasksFilter(args, stages);

      return models.Tasks.find(filter).countDocuments();
    }

    return 0;
  },

  /**
   * Tasks detail
   */
  async taskDetail(
    _root,
    { _id, clientPortalCard }: { _id: string; clientPortalCard: boolean },
    { user, models }: IContext,
  ) {
    const task = await models.Tasks.getTask(_id);

    // no need to check permission on cp task
    if (clientPortalCard) {
      return task;
    }

    const stage = await models.Stages.getStage(task.stageId);

    const {
      visibility,
      memberIds,
      departmentIds = [],
      branchIds = [],
      isCheckUser,
      excludeCheckUserIds,
    } = await models.Pipelines.getPipeline(stage.pipelineId);

    const supervisorDepartments = await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'departments',
      action: 'findWithChild',
      input: {
        query: {
          supervisorId: user?._id,
        },
        fields: {
          _id: 1,
        },
      },
      defaultValue: [],
    });

    const supervisorDepartmentIds =
      supervisorDepartments?.map((x) => x._id) || [];
    // const userDepartmentIds = user.departmentIds || [];
    // const userBranchIds = user?.branchIds || [];

    // // check permission on department
    // const hasUserInDepartment = compareDepartmentIds(departmentIds, [
    //   ...userDepartmentIds,
    //   ...supervisorDepartmentIds,
    // ]);
    // const isUserInBranch = compareDepartmentIds(branchIds, userBranchIds);

    // if (
    //   visibility === 'private' &&
    //   !(memberIds || []).includes(user._id) &&
    //   !hasUserInDepartment &&
    //   !isUserInBranch &&
    //   user?.role !== USER_ROLES.SYSTEM
    // ) {
    //   throw new Error('You do not have permission to view.');
    // }

    const isSuperVisorInDepartment = compareDepartmentIds(
      departmentIds,
      supervisorDepartmentIds,
    );
    if (isSuperVisorInDepartment) {
      return task;
    }

    // pipeline is Show only the users assigned(created) cards checked
    // and current user nothing dominant users
    // current user hans't this carts assigned and created
    // if (
    //   isCheckUser &&
    //   !(excludeCheckUserIds || []).includes(user._id) &&
    //   !(
    //     (task.assignedUserIds || []).includes(user._id) ||
    //     task.userId === user._id
    //   )
    // ) {
    //   throw new Error('You do not have permission to view.');
    // }

    return task;
  },
};
