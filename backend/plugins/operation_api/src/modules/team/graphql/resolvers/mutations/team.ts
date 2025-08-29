import { IContext } from '~/connectionResolvers';
import { TeamMemberRoles } from '@/team/@types/team';
import { checkUserRole } from '@/utils';

export const teamMutations = {
  teamAdd: async (
    _parent: undefined,
    {
      name,
      description,
      icon,
      memberIds,
    }: { name: string; description: string; icon: string; memberIds: string[] },
    { models, user }: IContext,
  ) => {
    const userId = user._id;
    memberIds = memberIds || [];
    memberIds = memberIds.includes(userId)
      ? memberIds.filter((id) => id !== userId)
      : [...memberIds];

    return models.Team.createTeam({
      teamDoc: {
        name,
        description,
        icon,
        estimateType: 1,
      },
      memberIds,
      adminId: userId,
    });
  },

  teamUpdate: async (
    _parent: undefined,
    {
      _id,
      name,
      description,
      icon,
      estimateType,
      cycleEnabled,
    }: {
      _id: string;
      name: string;
      description: string;
      icon: string;
      estimateType: number;
      cycleEnabled: boolean;
    },
    { models, user }: IContext,
  ) => {
    await checkUserRole({
      models,
      teamId: _id,
      userId: user._id,
      allowedRoles: [TeamMemberRoles.ADMIN, TeamMemberRoles.LEAD],
    });

    return models.Team.updateTeam(_id, {
      name,
      description,
      icon,
      estimateType,
      cycleEnabled,
    });
  },

  teamRemove: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models, user }: IContext,
  ) => {
    await checkUserRole({
      models,
      teamId: _id,
      userId: user._id,
      allowedRoles: [TeamMemberRoles.ADMIN],
    });

    return models.Team.removeTeam(_id);
  },

  teamAddMembers: async (
    _parent: undefined,
    { _id, memberIds }: { _id: string; memberIds: string[] },
    { models, user }: IContext,
  ) => {
    await checkUserRole({
      models,
      teamId: _id,
      userId: user._id,
      allowedRoles: [TeamMemberRoles.ADMIN, TeamMemberRoles.LEAD],
    });

    return models.TeamMember.createTeamMembers(
      memberIds.map((memberId) => ({
        memberId,
        teamId: _id,
        role: TeamMemberRoles.MEMBER,
      })),
    );
  },

  teamRemoveMember: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models, user }: IContext,
  ) => {
    await checkUserRole({
      models,
      teamId: _id,
      userId: user._id,
      allowedRoles: [TeamMemberRoles.ADMIN],
    });

    return models.TeamMember.removeTeamMember(_id);
  },

  teamUpdateMember: async (
    _parent: undefined,
    { _id, role }: { _id: string; memberId: string; role: TeamMemberRoles },
    { models, user }: IContext,
  ) => {
    const teamMember = await models.TeamMember.findOne({ _id });

    if (!teamMember) {
      throw new Error('Team member not found');
    }

    await checkUserRole({
      models,
      teamId: teamMember.teamId,
      userId: user._id,
      allowedRoles: [TeamMemberRoles.ADMIN],
    });

    return models.TeamMember.updateTeamMember(_id, role);
  },
};
