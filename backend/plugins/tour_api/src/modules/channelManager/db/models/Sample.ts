import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { sampleSchema } from '@/sample/db/definitions/sample';
import { ISample, ISampleDocument } from '@/sample/@types/sample';

export interface ISampleModel extends Model<ISampleDocument> {
  getSample(_id: string): Promise<ISampleDocument>;
  createSample(doc: ISample): Promise<ISampleDocument>;
  updateSample(_id: string, doc: ISample): Promise<ISampleDocument>;
  removeSample(_id: string[]): Promise<{ n: number; ok: number }>;
}

export const loadSampleClass = (models: IModels) => {
  class Sample {
    /**
     * Retrieves sample
     */
    public static async getSample(_id: string) {
      const sample = await models.Samples.findOne({ _id }).lean();

      if (!sample) {
        throw new Error('Sample not found');
      }

      return sample;
    }

    /**
     * Create a sample
     */
    public static async createSample(doc: ISample): Promise<ISampleDocument> {
      return models.Samples.create(doc);
    }

    /*
     * Update sample
     */
    public static async updateSample(_id: string, doc: ISample) {
      return await models.Samples.findOneAndUpdate(
        { _id },
        { $set: { ...doc } },
      );
    }

    /**
     * Remove samples
     */
    public static async removeSamples(sampleIds: string[]) {
      return models.Samples.deleteMany({ _id: { $in: sampleIds } });
    }
  }

  sampleSchema.loadClass(Sample);

  return sampleSchema;
};
