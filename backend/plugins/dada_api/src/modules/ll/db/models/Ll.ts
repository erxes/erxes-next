import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { llSchema } from '@/ll/db/definitions/ll';
import { ILl, ILlDocument } from '@/ll/@types/ll';

export interface ILlModel extends Model<ILlDocument> {
  getLl(_id: string): Promise<ILlDocument>;
  createLl(doc: ILl): Promise<ILlDocument>;
  updateLl(_id: string, doc: ILl): Promise<ILlDocument>;
  removeLl(LlId: string): Promise<{  ok: number }>;
}

export const loadLlClass = (models: IModels) => {
  class Ll {
    /**
     * Retrieves dada
     */
    public static async getLl(_id: string) {
      const Ll = await models.Ll.findOne({ _id }).lean();

      if (!Ll) {
        throw new Error('Ll not found');
      }

      return Ll;
    }

    /**
     * Create a dada
     */
    public static async createLl(doc: ILl): Promise<ILlDocument> {
      return models.Ll.create(doc);
    }

    /*
     * Update dada
     */
    public static async updateLl(_id: string, doc: ILl) {
      return await models.Ll.findOneAndUpdate(
        { _id },
        { $set: { ...doc } },
      );
    }

    /**
     * Remove dada
     */
    public static async removeLl(LlId: string[]) {
      return models.Ll.deleteOne({ _id: { $in: LlId } });
    }
  }

  llSchema.loadClass(Ll);

  return llSchema;
};
