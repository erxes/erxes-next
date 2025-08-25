import { IProjectUpdate } from '@/project/@types/project';
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
    params: IProjectUpdate,
    { models, user, subdomain }: IContext,
  ) => {
    const project = await models.Project.getProject(params._id);
    await checkUserRole({
      models,
      teamIds: project.teamIds,
      userId: user._id,
      allowedRoles: [TeamMemberRoles.ADMIN, TeamMemberRoles.LEAD],
    });

    return models.Project.updateProject({
      doc: params,
      userId: user._id,
      subdomain,
    });
  },
  removeProject: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Project.removeProject(_id);
  },
};
