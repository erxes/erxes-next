import { Model } from 'mongoose';
import { ITeam, ITeamDocument } from '@/team/@types/team';
import { ITeamFilter } from '@/team/@types/team';
import { teamSchema } from '@/team/db/definitions/team';
import { IModels } from '~/connectionResolvers';

export interface ITeamModel extends Model<ITeamDocument> {
  getTeam(_id: string): Promise<ITeamDocument>;
  getTeams(params: ITeamFilter): Promise<ITeamDocument[]>;
  getTeamsByMember(memberId: string): Promise<ITeamDocument[]>;
  createTeam(doc: ITeam): Promise<ITeamDocument>;
  updateTeam(_id: string, doc: ITeam): Promise<ITeamDocument>;
  removeTeam(teamId: string[]): Promise<{ ok: number }>;
}

export const loadTeamClass = (models: IModels) => {
  class Team {
    public static async getTeam(_id: string) {
      const team = await models.Team.findOne({ _id }).lean();

      if (!team) {
        throw new Error('Team not found');
      }

      return team;
    }

    public static async getTeamsByMember(
      memberId: string,
    ): Promise<ITeamDocument[]> {
      return models.Team.find({ memberIds: memberId }).lean();
    }

    public static async getTeams(
      params: ITeamFilter,
    ): Promise<ITeamDocument[]> {
      const query = {} as any;

      if (params.name) {
        query.name = params.name;
      }

      if (params.description) {
        query.description = params.description;
      }

      if (params.icon) {
        query.icon = params.icon;
      }

      if (params.memberIds) {
        query.memberIds = params.memberIds;
      }

      return models.Team.find(query).lean();
    }

    public static async createTeam(doc: ITeam): Promise<ITeamDocument> {
      const team = await models.Team.insertOne(doc);

      await models.Status.createDefaultStatuses(team._id);

      return team;
    }

    public static async updateTeam(_id: string, doc: ITeam) {
      return await models.Team.findOneAndUpdate({ _id }, { $set: { ...doc } });
    }

    public static async removeTeam(teamId: string[]) {
      return models.Team.deleteOne({ _id: { $in: teamId } });
    }
  }

  teamSchema.loadClass(Team);

  return teamSchema;
};
