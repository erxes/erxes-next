import { moduleRequireLogin } from "erxes-api-shared/core-modules";
import { defaultPaginate } from "erxes-api-shared/utils";
import { sendTRPCMessage } from "erxes-api-shared/utils/trpc";
import { IContext } from "~/connectionResolvers";



export const pipelineQueries = {
    /**
     *  Pipelines list
     */
    async tasksPipelines(
      _root,
      {
        boardId,
        type,
        isAll,
        ...queryParams
      }: {
        boardId: string;
        type: string;
        isAll: boolean;
        page: number;
        perPage: number;
      },
      { user, models }: IContext,
    ) {
      const query: any =
        user.isOwner || isAll
          ? {}
          : {
              status: { $ne: 'archived' },
              $or: [
                { visibility: 'public' },
                {
                  $and: [
                    { visibility: 'private' },
                    {
                      $or: [
                        { memberIds: { $in: [user._id] } },
                        { userId: user._id },
                      ],
                    },
                  ],
                },
              ],
            };
  
      if (!user.isOwner && !isAll) {
        const userDetail = await sendTRPCMessage({
          pluginName: 'core',
          method: 'query',
          module: 'user',
          action: 'find',
          input: {
            _id: user._id,
          },
          defaultValue: {},
        });
  
        const departmentIds = userDetail?.departmentIds || [];
  
        if (Object.keys(query) && departmentIds.length > 0) {
          query.$or.push({
            $and: [
              { visibility: 'private' },
              { departmentIds: { $in: departmentIds } },
            ],
          });
        }
      }
  
      const { page, perPage } = queryParams;
  
      if (boardId) {
        query.boardId = boardId;
      }
  
      if (type) {
        query.type = type;
      }
  
      if (page && perPage) {
        return defaultPaginate(
          models.Pipelines.find(query).sort({ createdAt: 1 }),
          queryParams,
        );
      }
  
      return models.Pipelines.find(query)
        .sort({ order: 1, createdAt: -1 })
        .lean();
    },
  
    async salesPipelineStateCount(
      _root,
      { boardId, type }: { boardId: string; type: string },
      { models }: IContext,
    ) {
      const query: any = {};
  
      if (boardId) {
        query.boardId = boardId;
      }
  
      if (type) {
        query.type = type;
      }
  
      const counts: any = {};
      const now = new Date();
  
      const notStartedQuery = {
        ...query,
        startDate: { $gt: now },
      };
  
      const notStartedCount = await models.Pipelines.find(
        notStartedQuery,
      ).countDocuments();
  
      counts['Not started'] = notStartedCount;
  
      const inProgressQuery = {
        ...query,
        startDate: { $lt: now },
        endDate: { $gt: now },
      };
  
      const inProgressCount = await models.Pipelines.find(
        inProgressQuery,
      ).countDocuments();
  
      counts['In progress'] = inProgressCount;
  
      const completedQuery = {
        ...query,
        endDate: { $lt: now },
      };
  
      const completedCounted = await models.Pipelines.find(
        completedQuery,
      ).countDocuments();
  
      counts.Completed = completedCounted;
  
      counts.All = notStartedCount + inProgressCount + completedCounted;
  
      return counts;
    },
  
    /**
     *  Pipeline detail
     */
    async salesPipelineDetail(
      _root,
      { _id }: { _id: string },
      { models }: IContext,
    ) {
      return models.Pipelines.findOne({ _id }).lean();
    },
  
    /**
     *  Pipeline related assigned users
     */
    async salesPipelineAssignedUsers(
      _root,
      { _id }: { _id: string },
      { models }: IContext,
    ) {
      const pipeline = await models.Pipelines.getPipeline(_id);
      const stageIds = await models.Stages.find({
        pipelineId: pipeline._id,
      }).distinct('_id');
  
      const assignedUserIds = await models.Deals.find({
        stageId: { $in: stageIds },
      }).distinct('assignedUserIds');
  
      return assignedUserIds.map((userId) => ({
        __typename: 'User',
        _id: userId || '',
      }));
    },
  };
  
  moduleRequireLogin(pipelineQueries);
  