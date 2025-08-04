import { Model } from 'mongoose';
import {
  ITeamMember,
  ITeamMemberDocument,
  TeamMemberRoles,
} from '@/team/@types/team';
import { teamMembers } from '@/team/db/definitions/team';
import { IModels } from '~/connectionResolvers';

export interface ITeamMemberModel extends Model<ITeamMemberDocument> {
  getTeamMember(memberId: string, teamId: string): Promise<ITeamMemberDocument>;
  createTeamMember(doc: ITeamMember): Promise<ITeamMemberDocument>;
  updateTeamMember(
    memberId: string,
    teamId: string,
    doc: ITeamMember,
  ): Promise<ITeamMemberDocument>;

  createTeamMembers(members: ITeamMember[]): Promise<ITeamMemberDocument[]>;
  removeTeamMember(
    memberId: string,
    teamId: string,
  ): Promise<ITeamMemberDocument>;
}

export const loadTeamMemberClass = (models: IModels) => {
  class TeamMember {
    public static async getTeamMember(memberId: string, teamId: string) {
      return models.TeamMember.findOne({ memberId, teamId }).lean();
    }

    public static async createTeamMember(doc: ITeamMember) {
      return models.TeamMember.insertOne(doc);
    }

    public static async updateTeamMember(
      memberId: string,
      teamId: string,
      doc: ITeamMember,
    ) {
      return models.TeamMember.findOneAndUpdate(
        { memberId, teamId },
        { $set: { ...doc } },
      );
    }

    public static async createTeamMembers(members: ITeamMember[]) {
      return models.TeamMember.insertMany(members);
    }

    public static async removeTeamMember(memberId: string, teamId: string) {
      const teamMember = await models.TeamMember.findOne({ memberId, teamId });
      if (!teamMember) {
        throw new Error('Team member not found');
      }

      if (teamMember.role === TeamMemberRoles.ADMIN) {
        throw new Error('Admin cannot be removed');
      }

      return models.TeamMember.deleteOne({ memberId, teamId });
    }
  }

  teamMembers.loadClass(TeamMember);

  return teamMembers;
};
