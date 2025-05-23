import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { leactureSchema } from '@/leacture/db/definitions/leacture';
import { ILeacture, ILeactureDocument } from '@/leacture/@types/leacture';

export interface ILeactureModel extends Model<ILeactureDocument> {
  getLeacture(_id: string): Promise<ILeactureDocument>;
  getLeactures(): Promise<ILeactureDocument[]>;
  createLeacture(doc: ILeacture): Promise<ILeactureDocument>;
  updateLeacture(_id: string, doc: ILeacture): Promise<ILeactureDocument>;
  removeLeacture(LeactureId: string): Promise<{  ok: number }>;
}

export const loadLeactureClass = (models: IModels) => {
  class Leacture {
    /**
     * Retrieves workshop
     */
    public static async getLeacture(_id: string) {
      const Leacture = await models.Leacture.findOne({ _id }).lean();

      if (!Leacture) {
        throw new Error('Leacture not found');
      }

      return Leacture;
    }

    /**
     * Retrieves all workshops
     */
    public static async getLeactures(): Promise<ILeactureDocument[]> {
      return models.Leacture.find().lean();
    }

    /**
     * Create a workshop
     */
    public static async createLeacture(doc: ILeacture): Promise<ILeactureDocument> {
      return models.Leacture.create(doc);
    }

    /*
     * Update workshop
     */
    public static async updateLeacture(_id: string, doc: ILeacture) {
      return await models.Leacture.findOneAndUpdate(
        { _id },
        { $set: { ...doc } },
      );
    }

    /**
     * Remove workshop
     */
    public static async removeLeacture(LeactureId: string[]) {
      return models.Leacture.deleteOne({ _id: { $in: LeactureId } });
    }
  }

  leactureSchema.loadClass(Leacture);

  return leactureSchema;
};
