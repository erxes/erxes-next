import { regexSearchText, sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { TICKET_STATUSES } from '~/modules/tickets/constants';

export const stageQueries = {
  /**
   *  Stages list
   */
  async ticketsStages(
    _root: undefined,
    {
      pipelineId,
      pipelineIds,
      isNotLost,
      isAll,
    }: {
      pipelineId: string;
      pipelineIds: string[];
      isNotLost: boolean;
      isAll: boolean;
    },
    { user, models }: IContext,
  ) {
    const filter: any = {};

    filter.pipelineId = pipelineId;

    if (pipelineIds) {
      filter.pipelineId = { $in: pipelineIds };
    }

    if (isNotLost) {
      filter.probability = { $ne: 'Lost' };
    }

    if (!isAll) {
      filter.status = { $ne: TICKET_STATUSES.ARCHIVED };

      filter.$or = [
        { visibility: { $in: ['public', null] } },
        {
          $and: [{ visibility: 'private' }, { memberIds: { $in: [user._id] } }],
        },
      ];

      const userDetail = await sendTRPCMessage({
        pluginName: 'core',
        method: 'query',
        module: 'users',
        action: 'findOne',
        input: {
          _id: user._id,
        },
        defaultValue: [],
      });

      const departmentIds = userDetail?.departmentIds || [];
      if (departmentIds.length > 0) {
        filter.$or.push({
          $and: [
            { visibility: 'private' },
            { departmentIds: { $in: departmentIds } },
          ],
        });
      }
    }

    console.log('filter', filter);

    return await models.Stages.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .lean();
  },

  /**
   *  Stage detail
   */
  async ticketsStageDetail(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.Stages.findOne({ _id }).lean();
  },

  /**
   *  Archived stages
   */

  async ticketsArchivedStages(
    _root: undefined,
    { pipelineId, search }: { pipelineId: string; search?: string },
    { models }: IContext,
  ) {
    const filter: any = { pipelineId, status: TICKET_STATUSES.ARCHIVED };

    if (search) {
      Object.assign(filter, regexSearchText(search, 'name'));
    }

    return models.Stages.find(filter).sort({ createdAt: -1 });
  },

  async ticketsArchivedStagesCount(
    _root: undefined,
    { pipelineId, search }: { pipelineId: string; search?: string },
    { models }: IContext,
  ) {
    const filter: any = { pipelineId, status: TICKET_STATUSES.ARCHIVED };

    if (search) {
      Object.assign(filter, regexSearchText(search, 'name'));
    }

    return models.Stages.countDocuments(filter);
  },
};
