import { STRUCTURE_STATUSES } from 'erxes-api-shared/core-modules';
import { Model } from 'mongoose';
import {
  IDepartmentDocument,
  IUnitDocument,
  IBranchDocument,
  IStructureDocument,
  IPositionDocument,
} from '../../@types/structure';
import { IUserDocument } from 'erxes-api-shared/core-types';
import { IModels } from '~/connectionResolvers';
import {
  escapeRegExp,
  checkCollectionCodeDuplication,
} from 'erxes-api-shared/utils';
import {
  departmentSchema,
  structureSchema,
  branchSchema,
  positionSchema,
  unitSchema,
} from '@/organization/structure/db/definitions/structure';
export interface IStructureModel extends Model<IStructureDocument> {
  getStructure(doc: any): Promise<IStructureDocument>;
  createStructure(doc: any, user: IUserDocument): Promise<IStructureDocument>;
  updateStructure(
    _id: string,
    doc: any,
    user: IUserDocument,
  ): Promise<IStructureDocument>;
  removeStructure(_id: string): Promise<IStructureDocument>;
}

export const loadStructureClass = (models: IModels) => {
  class Structure {
    /*
     * Get a structure
     */
    public static async getStructure(doc: any) {
      const structure = await models.Structures.findOne(doc);

      if (!structure) {
        throw new Error('Structure not found');
      }

      return structure;
    }

    /*
     * Create an structure
     */
    public static async createStructure(doc: any, user: IUserDocument) {
      const structure = await models.Structures.create({
        ...doc,
        createdAt: new Date(),
        createdBy: user._id,
      });

      return structure;
    }

    /*
     * Update an structure
     */
    public static async updateStructure(
      _id: string,
      doc: any,
      user: IUserDocument,
    ) {
      await models.Structures.updateOne(
        { _id },
        {
          ...doc,
          updatedAt: new Date(),
          updatedBy: user._id,
        },
      );

      return models.Structures.findOne({ _id });
    }

    /*
     * Remove a structure
     */
    public static async removeStructure(_id: string) {
      const structure = await models.Structures.getStructure({ _id });
      await structure.deleteOne();
      return structure;
    }
  }

  structureSchema.loadClass(Structure);

  return structureSchema;
};

// loadStructureClass();

// // tslint:disable-next-line
// const models.Structures = model<IStructureDocument, IStructureModel>(
//   'structures',
//   structureSchema
// );

export interface IDepartmentModel extends Model<IDepartmentDocument> {
  getDepartment(doc: any): Promise<IDepartmentDocument>;
  createDepartment(doc: any, user: IUserDocument): Promise<IDepartmentDocument>;
  updateDepartment(
    _id: string,
    doc: any,
    user: IUserDocument,
  ): Promise<IDepartmentDocument>;
  removeDepartments(ids?: string[]): Promise<IDepartmentDocument>;
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
    public static async createDepartment(doc: any, user: IUserDocument) {
      await checkCollectionCodeDuplication(models.Departments, doc.code);

      const parent = await models.Departments.findOne({
        _id: doc.parentId,
      }).lean();

      doc.order = parent ? `${parent.order}${doc.code}/` : `${doc.code}/`;

      const department = await models.Departments.create({
        ...doc,
        createdAt: new Date(),
        createdBy: user._id,
      });
      await models.UserMovements.manageStructureUsersMovement({
        userIds: doc.userIds || department.userIds || [],
        contentType: 'department',
        contentTypeId: department._id,
        createdBy: user._id,
      });

      return department;
    }

    /*
     * Update a department
     */

    public static async updateDepartment(
      _id: string,
      doc: any,
      user: IUserDocument,
    ) {
      const department = await models.Departments.getDepartment({ _id });
      if (department?.code !== doc.code) {
        await checkCollectionCodeDuplication(models.Departments, doc.code);
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

      await models.UserMovements.manageStructureUsersMovement({
        userIds: doc.userIds || [],
        contentType: 'department',
        contentTypeId: _id,
        createdBy: user._id,
      });
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
      const userMovements = await models.UserMovements.find({
        contentType: 'department',
        contentTypeId: { $in: departmentIds },
      });

      if (userMovements.length) {
        return await models.Departments.updateMany(
          {
            $or: [
              { _id: { $in: departmentIds } },
              { parentId: { $in: departmentIds } },
            ],
          },
          { $set: { status: STRUCTURE_STATUSES.DELETED } },
        );
      }

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

export interface IUnitModel extends Model<IUnitDocument> {
  getUnit(doc: any): Promise<IUnitDocument>;
  createUnit(doc: any, user: IUserDocument): Promise<IUnitDocument>;
  updateUnit(
    _id: string,
    doc: any,
    user: IUserDocument,
  ): Promise<IUnitDocument>;
  removeUnits(ids?: string[]): Promise<IUnitDocument>;
}

export const loadUnitClass = (models: IModels) => {
  class Unit {
    /*
     * Get an unit
     */
    public static async getUnit(doc: any) {
      const unit = await models.Units.findOne(doc);

      if (!unit) {
        throw new Error('Unit not found');
      }

      return unit;
    }

    /*
     * Create an unit
     */
    public static async createUnit(doc: any, user: IUserDocument) {
      const unit = await models.Units.create({
        ...doc,
        createdAt: new Date(),
        createdBy: user._id,
      });

      return unit;
    }

    /*
     * Update an unit
     */
    public static async updateUnit(_id: string, doc: any, user: IUserDocument) {
      await models.Units.updateOne(
        { _id },
        {
          ...doc,
          updatedAt: new Date(),
          updatedBy: user._id,
        },
      );

      return models.Units.findOne({ _id });
    }

    /*
     * Remove an unit
     */
    public static async removeUnits(ids: string) {
      const units = await models.Units.find({ _id: { $in: ids } });

      const unitIds = units.map((unit) => unit._id);

      return await models.Units.deleteMany({ _id: { $in: unitIds } });
    }
  }

  unitSchema.loadClass(Unit);

  return unitSchema;
};

export interface IBranchModel extends Model<IBranchDocument> {
  getBranch(doc: any): Promise<IBranchDocument>;
  createBranch(doc: any, user: IUserDocument): Promise<IBranchDocument>;
  updateBranch(
    _id: string,
    doc: any,
    user: IUserDocument,
  ): Promise<IBranchDocument>;
  removeBranches(ids?: string[]): Promise<IBranchDocument>;
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
    public static async createBranch(doc: any, user: IUserDocument) {
      await checkCollectionCodeDuplication(models.Branches, doc.code);

      const parent = await models.Branches.findOne({
        _id: doc.parentId,
      }).lean();

      doc.order = parent ? `${parent.order}${doc.code}/` : `${doc.code}/`;

      const branch = await models.Branches.create({
        ...doc,
        createdAt: new Date(),
        createdBy: user._id,
      });
        await models.UserMovements.manageStructureUsersMovement({
        userIds: doc.userIds || branch.userIds || [],
        contentType: 'branch',
        contentTypeId: branch._id,
        createdBy: user._id,
      });
      
      return branch;
    }

    /*
     * Update a branch
     */
    public static async updateBranch(
      _id: string,
      doc: any,
      user: IUserDocument,
    ) {
      const branch = await models.Branches.getBranch({ _id });

      if (branch?.code !== doc.code) {
        await checkCollectionCodeDuplication(models.Branches, doc.code);
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
      await models.UserMovements.manageStructureUsersMovement({
        userIds: doc.userIds || [],
        contentType: 'branch',
        contentTypeId: _id,
        createdBy: user._id,
      });

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
      const userMovements = await models.UserMovements.find({
        contentType: 'branch',
        contentTypeId: { $in: branchIds },
      });

      if (userMovements.length) {
        return await models.Branches.updateMany(
          {
            $or: [
              { _id: { $in: branchIds } },
              { parentId: { $in: branchIds } },
            ],
          },
          { $set: { status: STRUCTURE_STATUSES.DELETED } },
        );
      }

      return await models.Branches.deleteMany({
        $or: [{ _id: { $in: branchIds } }, { parentId: { $in: branchIds } }],
      });
    }
  }

  branchSchema.loadClass(Branch);

  return branchSchema;
};
export interface IPositionModel extends Model<IPositionDocument> {
  getPosition(doc: any): Promise<IPositionDocument>;
  createPosition(doc: any, user: IUserDocument): Promise<IPositionDocument>;
  updatePosition(
    _id: string,
    doc: any,
    user: IUserDocument,
  ): Promise<IPositionDocument>;
  removePositions(ids?: string[]): Promise<IPositionDocument>;
}

export const loadPositionClass = (models: IModels) => {
  class Position {
    /*
     * Get a position
     */
    public static async getPosition(doc: any) {
      const position = await models.Positions.findOne(doc);

      if (!position) {
        throw new Error('Position not found');
      }

      return position;
    }

    /*
     * Create a position
     */
    public static async createPosition(doc: any, user: IUserDocument) {
      await checkCollectionCodeDuplication(models.Positions, doc.code);

      const parent = await models.Positions.findOne({
        _id: doc.parentId,
      }).lean();

      doc.order = parent ? `${parent.order}${doc.code}/` : `${doc.code}/`;

      const position = await models.Positions.create({
        ...doc,
        createdAt: new Date(),
        createdBy: user._id,
      });

      await models.UserMovements.manageStructureUsersMovement({
        userIds: doc.userIds || position.userIds || [],
        contentType: 'position',
        contentTypeId: position._id,
        createdBy: user._id,
      });

      return position;
    }

    /*
     * Update a position
     */
    public static async updatePosition(
      _id: string,
      doc: any,
      user: IUserDocument,
    ) {
      const position = await models.Positions.getPosition({ _id });

      if (position?.code !== doc.code) {
        await checkCollectionCodeDuplication(models.Positions, doc.code);
      }

      const parent = await models.Positions.findOne({ _id: doc.parentId });

      if (parent && parent?.parentId === _id) {
        throw new Error('Cannot change a position');
      }

      doc.order = parent ? `${parent.order}${doc.code}/` : `${doc.code}/`;

      const children = await models.Positions.find({
        order: { $regex: new RegExp(`^${escapeRegExp(position.order)}`) },
      });

      for (const child of children) {
        let order = child.order;

        order = order.replace(position.order, doc.order);

        await models.Positions.updateOne(
          {
            _id: child._id,
          },
          {
            $set: { order },
          },
        );
      }
      await models.UserMovements.manageStructureUsersMovement({
        userIds: doc.userIds || [],
        contentType: 'position',
        contentTypeId: _id,
        createdBy: user._id,
      });

      await models.Positions.updateOne(
        { _id },
        {
          ...doc,
          updatedAt: new Date(),
          updatedBy: user._id,
        },
      );

      return models.Positions.findOne({ _id });
    }

    /*
     * Remove a branch
     */

    public static async removePositions(ids: string[]) {
      const positions = await models.Positions.find({ _id: { $in: ids } });

      const positionIds = positions.map((branch) => branch._id);
      const userMovements = await models.UserMovements.find({
        contentType: 'position',
        contentTypeId: { $in: positionIds },
      });

      if (userMovements.length) {
        return await models.Positions.updateMany(
          {
            $or: [
              { _id: { $in: positionIds } },
              { parentId: { $in: positionIds } },
            ],
          },
          { $set: { status: STRUCTURE_STATUSES.DELETED } },
        );
      }

      return await models.Positions.deleteMany({
        $or: [
          { _id: { $in: positionIds } },
          { parentId: { $in: positionIds } },
        ],
      });
    }
  }

  positionSchema.loadClass(Position);

  return positionSchema;
};
