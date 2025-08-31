import { STATUS_TYPES } from '@/status/constants/types';
import { IContext } from '~/connectionResolvers';
import { ICycleDocument } from '@/cycle/types';

export const Cycle = {
  async donePercent(
    cycle: ICycleDocument,
    _args: undefined,
    { models }: IContext,
  ) {
    if (cycle.isCompleted || !cycle.isActive) {
      return cycle.donePercent;
    }

    const result = await models.Task.aggregate([
      {
        $match: {
          cycleId: cycle._id,
          statusType: { $ne: STATUS_TYPES.CANCELLED },
        },
      },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          doneTasks: {
            $sum: {
              $cond: [
                {
                  $eq: ['$statusType', STATUS_TYPES.COMPLETED],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    if (!result.length || result[0].totalTasks === 0) {
      return 0;
    }

    return (result[0].doneTasks / result[0].totalTasks) * 100;
  },
};
