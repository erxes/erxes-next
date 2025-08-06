import { IProjectDocument } from '@/project/@types/project';
import { checkUserRole } from '@/utils';
import { TeamMemberRoles } from '@/team/@types/team';
import { IContext } from '~/connectionResolvers';

export const projectMutations = {
  createProject: async (
    _parent: undefined,
    {
      name,
      teamIds,
      startDate,
      targetDate,
      priority,
      status,
      description,
      leadId,
    },
    { models, user }: IContext,
  ) => {
    await checkUserRole({
      models,
      teamIds,
      userId: user._id,
      allowedRoles: [TeamMemberRoles.ADMIN, TeamMemberRoles.LEAD],
    });

    return models.Project.createProject({
      name,
      teamIds,
      startDate,
      targetDate,
      priority,
      status,
      description,
      leadId,
    });
  },
  updateProject: async (
    _parent: undefined,
    {
      _id,
      name,
      teamIds,
      startDate,
      targetDate,
      priority,
      status,
      description,
      leadId,
    }: IProjectDocument,
    { models, user }: IContext,
  ) => {
    const project = await models.Project.getProject(_id);
    await checkUserRole({
      models,
      teamIds: project.teamIds,
      userId: user._id,
      allowedRoles: [TeamMemberRoles.ADMIN, TeamMemberRoles.LEAD],
    });

    return models.Project.updateProject(_id, {
      name,
      teamIds,
      startDate,
      targetDate,
      priority,
      status,
      description,
      leadId,
    });
  },
  removeProject: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Project.removeProject(_id);
  },
};
