import { Model } from 'mongoose';
import { ITeamMember, ITeamMemberDocument } from '@/team/@types/team';
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

  createTeamMembers(roles: ITeamMember[]): Promise<ITeamMemberDocument[]>;
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

    public static async createTeamMembers(roles: ITeamMember[]) {
      return models.TeamMember.insertMany(roles);
    }
  }

  teamMembers.loadClass(TeamMember);

  return teamMembers;
};
