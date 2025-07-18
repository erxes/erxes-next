import { IUserDocument } from 'erxes-api-shared/core-types';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import {
  IChecklist,
  IChecklistDocument,
  IChecklistItem,
  IChecklistItemDocument,
} from '../../@types';
import {
  checklistItemSchema,
  checklistSchema,
} from '../definitions/checklists';

export interface IChecklistModel extends Model<IChecklistDocument> {
  getChecklist(_id: string): Promise<IChecklistDocument>;
  removeChecklists(contentTypeIds: string[]): void;
  createChecklist(
    { contentType, contentTypeId, ...fields }: IChecklist,
    user: IUserDocument,
  ): Promise<IChecklistDocument>;

  updateChecklist(_id: string, doc: IChecklist): Promise<IChecklistDocument>;

  removeChecklist(_id: string): void;
}

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

export const loadCheckListClass = (models: IModels) => {
  class Checklist {
    public static async getChecklist(_id: string) {
      const checklist = await models.Checklists.findOne({ _id });

      if (!checklist) {
        throw new Error('Checklist not found');
      }

      return checklist;
    }

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

    /*
     * Create new checklist
     */
    public static async createChecklist(
      { contentTypeId, ...fields }: IChecklist,
      user: IUserDocument,
    ) {
      const checklist = await models.Checklists.create({
        contentTypeId,
        createdUserId: user._id,
        createdDate: new Date(),
        ...fields,
      });

      //   putChecklistActivityLog(subdomain, {
      //     item: checklist,
      //     contentType: 'checklist',
      //     action: 'create',
      //   });

      return checklist;
    }

    /*
     * Update checklist
     */
    public static async updateChecklist(_id: string, doc: IChecklist) {
      await models.Checklists.updateOne({ _id }, { $set: doc });

      return models.Checklists.findOne({ _id });
    }

    /*
     * Remove checklist item
     */
    public static async removeChecklist(_id: string) {
      const checklistObj = await models.Checklists.findOne({ _id });

      if (!checklistObj) {
        throw new Error(`Checklist not found with id ${_id}`);
      }

      await models.ChecklistItems.deleteMany({
        checklistId: checklistObj._id,
      });

      //   await putChecklistActivityLog(subdomain, {
      //     item: checklistObj,
      //     contentType: 'checklist',
      //     action: 'delete',
      //   });

      await checklistObj.deleteOne();

      return checklistObj;
    }
  }

  checklistSchema.loadClass(Checklist);

  return checklistSchema;
};

export const loadCheckListItemClass = (models: IModels) => {
  class ChecklistItem {
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

      const checklistItem = await models.ChecklistItems.create({
        checklistId,
        createdUserId: user._id,
        createdDate: new Date(),
        order: itemsCount + 1,
        ...fields,
      });

      //   await putChecklistActivityLog(subdomain, {
      //     item: checklistItem,
      //     contentType: 'checklistItem',
      //     action: 'create',
      //   });

      return checklistItem;
    }

    /*
     * Update checklistItem
     */
    public static async updateChecklistItem(_id: string, doc: IChecklistItem) {
      await models.ChecklistItems.updateOne({ _id }, { $set: doc });

      const checklistItem = await models.ChecklistItems.findOne({ _id });

      //   await putChecklistActivityLog(subdomain, {
      //     item: checklistItem,
      //     contentType: 'checklistItem',
      //     action: activityAction,
      //   });

      return checklistItem;
    }

    /*
     * Remove checklist
     */
    public static async removeChecklistItem(_id: string) {
      const checklistItem = await models.ChecklistItems.findOneAndDelete({
        _id,
      });

      if (!checklistItem) {
        throw new Error(`Checklist item not found with id ${_id}`);
      }

      //   await putChecklistActivityLog(subdomain, {
      //     item: checklistItem,
      //     contentType: 'checklistItem',
      //     action: 'delete',
      //   });

      return checklistItem;
    }

    public static async updateItemOrder(_id: string, destinationOrder: number) {
      const currentItem = await models.ChecklistItems.findOne({ _id }).lean();

      if (!currentItem) {
        throw new Error(`Checklist item with id = ${_id} not found`);
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
