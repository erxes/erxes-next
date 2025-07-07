import { IUserDocument } from 'erxes-api-shared/core-types';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import {
  IChecklist,
  IChecklistDocument,
  IChecklistItem,
  IChecklistItemDocument,
} from '~/modules/tasks/@types/checklists';
import {
  checklistItemSchema,
  checklistSchema,
} from '~/modules/tasks/db/definitions/checklists';

export interface IChecklistModel extends Model<IChecklistDocument> {
  getChecklist(_id: string): Promise<IChecklistDocument>;
  createChecklist(
    { contentTypeId, ...fields }: IChecklist,
    user: IUserDocument,
  ): Promise<IChecklistDocument>;
  updateChecklist(_id: string, doc: IChecklist): Promise<IChecklistDocument>;
  removeChecklists(contentTypeIds: string[]): Promise<void>;
}

export const loadChecklistClass = (models: IModels) => {
  class Checklist {
    /*
     * Get a checklist
     */
    public static async getChecklist(_id: string) {
      const checklist = await models.Checklists.findOne({ _id });

      if (!checklist) {
        throw new Error('Checklist not found');
      }

      return checklist;
    }

    /*
     * Create new checklist
     */
    public static async createChecklist(
      { contentTypeId, ...fields }: IChecklist,
      user: IUserDocument,
    ) {
      return await models.Checklists.create({
        contentTypeId,
        createdUserId: user._id,
        ...fields,
      });
    }
    /*
     * Update checklist
     */
    public static async updateChecklist(_id: string, doc: IChecklist) {
      return await models.Checklists.findOneAndUpdate(
        { _id },
        { $set: doc },
        { new: true },
      );
    }

    /*
     * Remove checklist
     */
    public static async removeChecklists(contentTypeIds: string[]) {
      const checklists = await models.Checklists.find({
        contentTypeId: { $in: contentTypeIds },
      });

      if (checklists && checklists.length === 0) {
        return;
      }

      const checklistIds = checklists.map((list) => list._id);

      await models.ChecklistItems.deleteMany({
        checklistId: { $in: checklistIds },
      });

      await models.Checklists.deleteMany({ _id: { $in: checklistIds } });
    }
  }

  checklistSchema.loadClass(Checklist);

  return checklistSchema;
};

export interface IChecklistItemModel extends Model<IChecklistItemDocument> {
  getChecklistItem(_id: string): Promise<IChecklistItemDocument>;
  createChecklistItem(
    { checklistId, ...fields }: IChecklistItem,
    user: IUserDocument,
  ): Promise<IChecklistItemDocument>;
  updateChecklistItem(
    _id: string,
    doc: IChecklistItem,
  ): Promise<IChecklistItemDocument>;
  removeChecklistItem(_id: string): Promise<void>;
  updateItemOrder(
    _id: string,
    destinationOrder: number,
  ): Promise<IChecklistItemDocument>;
}

export const loadChecklistItemClass = (models: IModels) => {
  class ChecklistItem {
    /*
     * Get a checklistItem
     */
    public static async getChecklistItem(_id: string) {
      const checklistItem = await models.ChecklistItems.findOne({ _id });

      if (!checklistItem) {
        throw new Error('Checklist item not found');
      }

      return checklistItem;
    }

    /*
     * Create new checklistItem
     */
    public static async createChecklistItem(
      { checklistId, ...fields }: IChecklistItem,
      user: IUserDocument,
    ) {
      const itemsCount = await models.ChecklistItems.find({
        checklistId,
      }).countDocuments();

      return await models.ChecklistItems.create({
        checklistId,
        createdUserId: user._id,
        order: itemsCount + 1,
        ...fields,
      });
    }

    /*
     * Update checklistItem
     */
    public static async updateChecklistItem(_id: string, doc: IChecklistItem) {
      return await models.ChecklistItems.findOneAndUpdate(
        { _id },
        { $set: doc },
        { new: true },
      );
    }

    /*
     * Remove checklist item
     */
    public static async removeChecklistItem(_id: string) {
      const checklistItem = await models.ChecklistItems.findOneAndDelete({
        _id,
      });

      if (!checklistItem) {
        throw new Error(`Checklist item not found with id ${_id}`);
      }

      return checklistItem;
    }

    /*
     * Update checklistItem order
     */
    public static async updateItemOrder(_id: string, destinationOrder: number) {
      const currentItem = await models.ChecklistItems.findOne({ _id }).lean();

      if (!currentItem) {
        throw new Error(`ChecklistItems _id = ${_id} not found`);
      }

      await models.ChecklistItems.updateOne(
        { checklistId: currentItem.checklistId, order: destinationOrder },
        { $set: { order: currentItem.order } },
      );

      await models.ChecklistItems.updateOne(
        { _id },
        { $set: { order: destinationOrder } },
      );

      return models.ChecklistItems.findOne({ _id }).lean();
    }
  }

  checklistItemSchema.loadClass(ChecklistItem);

  return checklistItemSchema;
};
