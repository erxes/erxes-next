import { IContext } from '~/connectionResolvers';
import { ITeamFilter } from '@/team/@types/team';

export const teamQueries = {
  getTeam: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Team.getTeam(_id);
  },

  getMyTeams: async (
    _parent: undefined,
    _params: undefined,
    { models, user }: IContext,
  ) => {
    const userId = user._id;
    const teamIds = await models.TeamMember.find({ memberId: userId }).distinct(
      'teamId',
    );

    return models.Team.find({ _id: { $in: teamIds } });
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
