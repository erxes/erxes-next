import { IContext } from '~/connectionResolvers';
import { ITeamFilter } from '~/modules/team/@types/team';

export const teamQueries = {
  getTeam: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Team.getTeam(_id);
  },

  getTeams: async (
    _parent: undefined,
    params: ITeamFilter,
    { models }: IContext,
  ) => {
    return models.Team.getTeams(params);
  },

  getTeamMembers: async (
    _parent: undefined,
    { teamId }: { teamId: string },
    { models }: IContext,
  ) => {
    return models.TeamMember.find({ teamId });
  },
};
