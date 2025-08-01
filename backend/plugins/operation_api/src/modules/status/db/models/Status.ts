import { IStatusDocument } from '@/status/@types/status';
import { statusSchema } from '@/status/db/definitions/status';
import { IStatus, IStatusFilter } from '@/status/@types/status';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { generateDefaultStatuses } from '~/modules/status/utils';

export interface IStatusModel extends Model<IStatusDocument> {
  getStatus(_id: string): Promise<IStatusDocument>;
  getStatuses(params: IStatusFilter): Promise<IStatusDocument[]>;
  createStatus(doc: IStatus): Promise<IStatusDocument>;
  createDefaultStatuses(teamId: string): Promise<IStatusDocument[]>;
  updateStatus(_id: string, doc: IStatus): Promise<IStatusDocument>;
  removeStatus(_id: string): Promise<{ ok: number }>;
}

export const loadStatusClass = (models: IModels) => {
  class Status {
    public static async getStatus(_id: string) {
      const Status = await models.Status.findOne({ _id }).lean();

      if (!Status) {
        throw new Error('Status not found');
      }

      return Status;
    }

    public static async getStatuses(
      params: IStatusFilter,
    ): Promise<IStatusDocument[]> {
      const query = {} as any;

      if (params.teamId) {
        query.teamId = params.teamId;
      }

      if (params.type) {
        query.type = params.type;
      }

      return models.Status.find(query).lean();
    }

    public static async createStatus(doc: IStatus): Promise<IStatusDocument> {
      return models.Status.insertOne(doc);
    }

    public static async createDefaultStatuses(
      teamId: string,
    ): Promise<IStatusDocument[]> {
      const statuses = await generateDefaultStatuses(teamId);

      return models.Status.insertMany(statuses);
    }

    public static async updateStatus(_id: string, doc: IStatus) {
      return await models.Status.findOneAndUpdate(
        { _id },
        { $set: { ...doc } },
      );
    }

    public static async removeStatus(_id: string) {
      const task = await models.Task.findOne({ status: _id }).lean();

      if (task) {
        throw new Error('Status is used by task');
      }

      return await models.Status.deleteOne({ _id });
    }
  }

  statusSchema.loadClass(Status);

  return statusSchema;
};
