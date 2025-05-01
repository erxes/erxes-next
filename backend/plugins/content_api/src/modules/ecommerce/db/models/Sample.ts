import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { contentSchema } from '@/content/db/definitions/content';
import { Icontent, IcontentDocument } from '@/content/@types/content';

export interface IcontentModel extends Model<IcontentDocument> {
  getcontent(_id: string): Promise<IcontentDocument>;
  createcontent(doc: Icontent): Promise<IcontentDocument>;
  updatecontent(_id: string, doc: Icontent): Promise<IcontentDocument>;
  removecontent(_id: string[]): Promise<{ n: number; ok: number }>;
}

export const loadcontentClass = (models: IModels) => {
  class content {
    /**
     * Retrieves content
     */
    public static async getcontent(_id: string) {
      const content = await models.contents.findOne({ _id }).lean();

      if (!content) {
        throw new Error('content not found');
      }

      return content;
    }

    /**
     * Create a content
     */
    public static async createcontent(doc: Icontent): Promise<IcontentDocument> {
      return models.contents.create(doc);
    }

    /*
     * Update content
     */
    public static async updatecontent(_id: string, doc: Icontent) {
      return await models.contents.findOneAndUpdate(
        { _id },
        { $set: { ...doc } },
      );
    }

    /**
     * Remove contents
     */
    public static async removecontents(contentIds: string[]) {
      return models.contents.deleteMany({ _id: { $in: contentIds } });
    }
  }

  contentSchema.loadClass(content);

  return contentSchema;
};
