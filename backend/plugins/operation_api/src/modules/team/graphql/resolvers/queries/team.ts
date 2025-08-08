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
    if (params.teamIds && params.teamIds.length > 0) {
      return models.Team.find({ _id: { $in: params.teamIds } });
    }
    if (params.userId) {
      const teamIds = await models.TeamMember.find({
        memberId: params.userId,
      }).distinct('teamId');
      return models.Team.find({ _id: { $in: teamIds } });
    }
    return models.Team.getTeams(params);
  },

  getTeamMembers: async (
    _parent: undefined,
    { teamId, teamIds }: { teamId: string; teamIds: string[] },
    { models }: IContext,
  ) => {
    if (teamIds && teamIds.length > 0) {
      const uniqueMembers = await models.TeamMember.aggregate([
        {
          $match: {
            teamId: { $in: teamIds },
          },
        },
        {
          $sort: { _id: -1 },
        },
        {
          $group: {
            _id: '$memberId',
            doc: { $first: '$$ROOT' },
          },
        },
        {
          $replaceRoot: { newRoot: '$doc' },
        },
      ]);

      return uniqueMembers;
    }

    return models.TeamMember.find({ teamId });
  },
};
