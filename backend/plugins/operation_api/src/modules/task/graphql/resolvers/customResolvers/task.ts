import { ITaskDocument } from '@/task/@types/task';
import { IContext } from '~/connectionResolvers';
import { getTeamEstimateChoises } from '@/team/utils';

export const Task = {
  async estimateChoices(
    task: ITaskDocument,
    _params: undefined,
    { models }: IContext,
  ): Promise<{ value: number; label: string }[] | null> {
    const team = await models.Team.getTeam(task.teamId);

    return getTeamEstimateChoises(team.estimateType);
  },
};
