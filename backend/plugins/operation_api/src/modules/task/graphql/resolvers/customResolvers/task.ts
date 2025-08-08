import { ITaskDocument } from '@/task/@types/task';
import { IContext } from '~/connectionResolvers';
import { TeamEstimateTypes } from '@/team/@types/team';

export const Task = {
  async estimateChoices(
    task: ITaskDocument,
    { models }: IContext,
  ): Promise<{ value: number; label: string }[] | null> {
    const team = await models.Team.getTeam(task.teamId);

    switch (team.estimateType) {
      case TeamEstimateTypes.NOT_IN_USE:
        return null;
      case TeamEstimateTypes.DEFAULT:
        return [
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 3, label: '3' },
          { value: 4, label: '4' },
          { value: 5, label: '5' },
        ];
      case TeamEstimateTypes.FIBONACCI:
        return [
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 3, label: '3' },
          { value: 5, label: '5' },
          { value: 8, label: '8' },
        ];
      case TeamEstimateTypes.EXPONENTIAL:
        return [
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 4, label: '4' },
          { value: 8, label: '8' },
          { value: 16, label: '16' },
        ];
      default:
        return null;
    }
  },
};
