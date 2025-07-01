import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { savingSchema } from '@/saving/db/definitions/saving';
import { ISaving, ISavingDocument } from '@/saving/@types/saving';

export interface ISavingModel extends Model<ISavingDocument> {
  getSaving(_id: string): Promise<ISavingDocument>;
  getSavings(): Promise<ISavingDocument[]>;
  createSaving(doc: ISaving): Promise<ISavingDocument>;
  updateSaving(_id: string, doc: ISaving): Promise<ISavingDocument>;
  removeSaving(SavingId: string): Promise<{  ok: number }>;
}

export const loadSavingClass = (models: IModels) => {
  class Saving {
    /**
     * Retrieves finance
     */
    public static async getSaving(_id: string) {
      const Saving = await models.Saving.findOne({ _id }).lean();

      if (!Saving) {
        throw new Error('Saving not found');
      }

      return Saving;
    }

    /**
     * Retrieves all finances
     */
    public static async getSavings(): Promise<ISavingDocument[]> {
      return models.Saving.find().lean();
    }

    /**
     * Create a finance
     */
    public static async createSaving(doc: ISaving): Promise<ISavingDocument> {
      return models.Saving.create(doc);
    }

    /*
     * Update finance
     */
    public static async updateSaving(_id: string, doc: ISaving) {
      return await models.Saving.findOneAndUpdate(
        { _id },
        { $set: { ...doc } },
      );
    }

    /**
     * Remove finance
     */
    public static async removeSaving(SavingId: string[]) {
      return models.Saving.deleteOne({ _id: { $in: SavingId } });
    }
  }

  savingSchema.loadClass(Saving);

  return savingSchema;
};
