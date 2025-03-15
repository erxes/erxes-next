import { IModels } from 'backend/core-api/src/connectionResolvers';
import { IDepartmentDocument } from 'backend/core-api/src/modules/structure/types';
import { checkCodeDuplication, escapeRegExp } from 'erxes-api-utils';
import { Model } from 'mongoose';
import { departmentSchema } from '../../definitions/structure/department';

export interface IDepartmentModel extends Model<IDepartmentDocument> {
  getDepartment(doc: any): IDepartmentDocument;
  createDepartment(doc: any, user: any): IDepartmentDocument;
  updateDepartment(_id: string, doc: any, user: any): IDepartmentDocument;
  removeDepartments(ids?: string[]): IDepartmentDocument;
}

export const loadDepartmentClass = (models: IModels) => {
  class Department {
    /*
     * Get a department
     */
    public static async getDepartment(doc: any) {
      const department = await models.Departments.findOne(doc);

      if (!department) {
        throw new Error('Department not found');
      }

      return department;
    }

    /*
     * Create an department
     */
    public static async createDepartment(doc: any, user: any) {
      await checkCodeDuplication(models.Departments, doc.code);

      const parent = await models.Departments.findOne({
        _id: doc.parentId,
      }).lean();

      doc.order = parent ? `${parent.order}${doc.code}/` : `${doc.code}/`;

      const department = await models.Departments.create({
        ...doc,
        createdAt: new Date(),
        createdBy: user._id,
      });

      return department;
    }

    /*
     * Update a department
     */

    public static async updateDepartment(_id: string, doc: any, user: any) {
      const department = await models.Departments.getDepartment({ _id });
      if (department?.code !== doc.code) {
        await checkCodeDuplication(models.Departments, doc.code);
      }

      const parent = await models.Departments.findOne({
        _id: doc.parentId,
      });

      if (parent && parent?.parentId === _id) {
        throw new Error('Cannot change a department');
      }

      doc.order = parent ? `${parent.order}${doc.code}/` : `${doc.code}/`;
      const children = await models.Departments.find({
        order: { $regex: new RegExp(`^${escapeRegExp(department.order)}`) },
      });

      for (const child of children) {
        let order = child.order;

        order = order.replace(department.order, doc.order);

        await models.Departments.updateOne(
          {
            _id: child._id,
          },
          {
            $set: { order },
          },
        );
      }

      await models.Departments.updateOne(
        { _id },
        {
          ...doc,
          updatedAt: new Date(),
          updatedBy: user._id,
        },
      );

      return models.Departments.findOne({ _id });
    }

    /*
     * Remove a department
     */

    public static async removeDepartments(ids: string[]) {
      const departments = await models.Departments.find({ _id: { $in: ids } });

      const departmentIds = departments.map((department) => department._id);

      return await models.Departments.deleteMany({
        $or: [
          { _id: { $in: departmentIds } },
          { parentId: { $in: departmentIds } },
        ],
      });
    }
  }

  departmentSchema.loadClass(Department);

  return departmentSchema;
};
