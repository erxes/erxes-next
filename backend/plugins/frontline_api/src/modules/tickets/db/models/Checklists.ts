import { IUserDocument } from 'erxes-api-shared/core-types';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import {
  IChecklist,
  IChecklistDocument,
  IChecklistItem,
  IChecklistItemDocument,
} from '~/modules/tickets/@types/checklist';
import {
  checklistItemSchema,
  checklistSchema,
} from '~/modules/tickets/db/definitions/checklists';

export interface IChecklistModel extends Model<IChecklistDocument> {
  getChecklist(_id: string): Promise<IChecklistDocument>;
  removeChecklists(contentTypeIds: string[]): void;
  createChecklist(
    { contentTypeId, ...fields }: IChecklist,
    user: IUserDocument,
  ): Promise<IChecklistDocument>;

  updateChecklist(_id: string, doc: IChecklist): Promise<IChecklistDocument>;

  removeChecklist(_id: string): void;
}

export const loadChecklistClass = (models: IModels) => {
  class Checklist {
    public static async getChecklist(_id: string) {
      const checklist = await models.CheckLists.findOne({ _id });

      if (!checklist) {
        throw new Error('Checklist not found');
      }

      return checklist;
    }

    public static async removeChecklists(contentTypeIds: string[]) {
      const checklists = await models.CheckLists.find({
        contentTypeId: { $in: contentTypeIds },
      });

      if (checklists && checklists.length === 0) {
        return;
      }

      const checklistIds = checklists.map((list) => list._id);

      await models.CheckListItems.deleteMany({
        checklistId: { $in: checklistIds },
      });

      await models.CheckLists.deleteMany({ _id: { $in: checklistIds } });
    }

    /*
     * Create new checklist
     */
    public static async createChecklist(
      { contentTypeId, ...fields }: IChecklist,
      user: IUserDocument,
    ) {
      return await models.CheckLists.create({
        contentTypeId,
        createdUserId: user._id,
        createdDate: new Date(),
        ...fields,
      });
    }

    /*
     * Update checklist
     */
    public static async updateChecklist(_id: string, doc: IChecklist) {
      return await models.CheckLists.findOneAndUpdate(
        { _id },
        { $set: doc },
        { new: true },
      );
    }

    /*
     * Remove checklist
     */
    public static async removeChecklist(_id: string) {
      const checklist = await models.CheckLists.getChecklist(_id);

      await models.CheckListItems.deleteMany({
        checklistId: checklist._id,
      });

      return await models.CheckLists.findOneAndDelete({ _id });
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
  removeChecklistItem(_id: string): void;
  updateItemOrder(
    _id: string,
    destinationOrder: number,
  ): Promise<IChecklistItemDocument>;
}

export const loadChecklistItemClass = (models: IModels) => {
  class ChecklistItem {
    public static async getChecklistItem(_id: string) {
      const checklistItem = await models.CheckListItems.findOne({ _id });

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
      const itemsCount = await models.CheckListItems.find({
        checklistId,
      }).countDocuments();

      return await models.CheckListItems.create({
        checklistId,
        createdUserId: user._id,
        createdDate: new Date(),
        order: itemsCount + 1,
        ...fields,
      });
    }

    /*
     * Update checklistItem
     */
    public static async updateChecklistItem(_id: string, doc: IChecklistItem) {
      return await models.CheckListItems.findOneAndUpdate(
        { _id },
        { $set: doc },
        { new: true },
      );
    }

    /*
     * Remove checklist
     */
    public static async removeChecklistItem(_id: string) {
      const checklistItem = await models.CheckListItems.findOneAndDelete({
        _id,
      });

      if (!checklistItem) {
        throw new Error(`Checklist's item not found with id ${_id}`);
      }

      return checklistItem;
    }

    public static async updateItemOrder(_id: string, destinationOrder: number) {
      const currentItem = await models.CheckListItems.findOne({ _id }).lean();

      if (!currentItem) {
        throw new Error(`ChecklistItems _id = ${_id} not found`);
      }

      await models.CheckListItems.updateOne(
        { checklistId: currentItem.checklistId, order: destinationOrder },
        { $set: { order: currentItem.order } },
      );

      await models.CheckListItems.updateOne(
        { _id },
        { $set: { order: destinationOrder } },
      );

      return models.CheckListItems.findOne({ _id }).lean();
    }
  }

  checklistItemSchema.loadClass(ChecklistItem);

  return checklistItemSchema;
};
