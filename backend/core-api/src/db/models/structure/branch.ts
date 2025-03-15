import { IModels } from 'backend/core-api/src/connectionResolvers';
import { IBranchDocument } from 'backend/core-api/src/modules/structure/types';
import { checkCodeDuplication, escapeRegExp } from 'erxes-api-utils';
import { Model } from 'mongoose';
import { branchSchema } from '../../definitions/structure/branch';

export interface IBranchModel extends Model<IBranchDocument> {
  getBranch(doc: any): IBranchDocument;
  createBranch(doc: any, user: any): IBranchDocument;
  updateBranch(_id: string, doc: any, user: any): IBranchDocument;
  removeBranches(ids?: string[]): IBranchDocument;
}

export const loadBranchClass = (models: IModels) => {
  class Branch {
    /*
     * Get a branch
     */
    public static async getBranch(doc: any) {
      const branch = await models.Branches.findOne(doc);

      if (!branch) {
        throw new Error('Branch not found');
      }

      return branch;
    }

    /*
     * Create a branch
     */
    public static async createBranch(doc: any, user: any) {
      await checkCodeDuplication(models.Branches, doc.code);

      const parent = await models.Branches.findOne({
        _id: doc.parentId,
      }).lean();

      doc.order = parent ? `${parent.order}${doc.code}/` : `${doc.code}/`;

      const branch = await models.Branches.create({
        ...doc,
        createdAt: new Date(),
        createdBy: user._id,
      });

      return branch;
    }

    /*
     * Update a branch
     */
    public static async updateBranch(_id: string, doc: any, user: any) {
      const branch = await models.Branches.getBranch({ _id });

      if (branch?.code !== doc.code) {
        await checkCodeDuplication(models.Branches, doc.code);
      }

      const parent = await models.Branches.findOne({ _id: doc.parentId });

      if (parent && parent?.parentId === _id) {
        throw new Error('Cannot change a branch');
      }

      doc.order = parent ? `${parent.order}${doc.code}/` : `${doc.code}/`;

      const children = await models.Branches.find({
        order: { $regex: new RegExp(`^${escapeRegExp(branch.order)}`) },
      });

      for (const child of children) {
        let order = child.order;

        order = order.replace(branch.order, doc.order);

        await models.Branches.updateOne(
          {
            _id: child._id,
          },
          {
            $set: { order },
          },
        );
      }

      await models.Branches.updateOne(
        { _id },
        {
          ...doc,
          updatedAt: new Date(),
          updatedBy: user._id,
        },
      );

      return models.Branches.findOne({ _id });
    }

    /*
     * Remove a branch
     */

    public static async removeBranches(ids: string[]) {
      const branches = await models.Branches.find({ _id: { $in: ids } });

      const branchIds = branches.map((branch) => branch._id);

      return await models.Branches.deleteMany({
        $or: [{ _id: { $in: branchIds } }, { parentId: { $in: branchIds } }],
      });
    }
  }

  branchSchema.loadClass(Branch);

  return branchSchema;
};
