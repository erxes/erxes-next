import { Model } from 'mongoose';
import { ITeamDocument } from '@/team/@types/team';
import { ITeam } from '@/team/@types/team';
import { teamSchema } from '@/team/db/definitions/team';
import { IModels } from '~/connectionResolvers';

export interface ITeamModel extends Model<ITeamDocument> {
  getTeam(_id: string): Promise<ITeamDocument>;
  getTeams(filter: any): Promise<ITeamDocument[]>;
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

    public static async getTeams(filter: any): Promise<ITeamDocument[]> {
      return models.Team.find(filter).lean();
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
