import { ITaskDocument } from '@/task/@types/task';
import { IContext } from '~/connectionResolvers';
import { TeamEstimateTypes } from '@/team/@types/team';

export const Task = {
  async estimateChoices(
    task: ITaskDocument,
    _params: undefined,
    { models }: IContext,
  ): Promise<{ value: number; label: string }[] | null> {
    const team = await models.Team.getTeam(task.teamId);

    switch (team.estimateType) {
      case TeamEstimateTypes.NOT_IN_USE:
        return null;
      case TeamEstimateTypes.DEFAULT:
        return [
          { value: 1, label: '1 points' },
          { value: 2, label: '2 points' },
          { value: 3, label: '3 points' },
          { value: 4, label: '4 points' },
          { value: 5, label: '5 points' },
        ];
      case TeamEstimateTypes.FIBONACCI:
        return [
          { value: 1, label: '1 points' },
          { value: 2, label: '2 points' },
          { value: 3, label: '3 points' },
          { value: 5, label: '5 points' },
          { value: 8, label: '8 points' },
        ];
      case TeamEstimateTypes.EXPONENTIAL:
        return [
          { value: 1, label: '1 points' },
          { value: 2, label: '2 points' },
          { value: 4, label: '4 points' },
          { value: 8, label: '8 points' },
          { value: 16, label: '16 points' },
        ];
      default:
        return null;
    }
  },
};
