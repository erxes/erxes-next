import { createGenerateModels } from 'erxes-api-utils';
import mongoose from 'mongoose';
import { ICustomerModel, loadCustomerClass } from './db/models/Customers';
import { ICustomerDocument } from './modules/contacts/customers/@types/customers';
import { IContext as IMainContext } from './modules/@types/common';
import {
  IDepartmentModel,
  loadDepartmentClass,
} from './db/models/structure/department';
import { IBranchModel, loadBranchClass } from './db/models/structure/branch';
import { IUnitModel, loadUnitClass } from './db/models/structure/unit';
import {
  IStructureModel,
  loadStructureClass,
} from './db/models/structure/structure';
import {
  IPositionModel,
  loadPositionClass,
} from './db/models/structure/position';
import {
  IBranchDocument,
  IDepartmentDocument,
  IPositionDocument,
  IStructureDocument,
  IUnitDocument,
} from './modules/structure/types';

export interface IModels {
  Customers: ICustomerModel;
  Departments: IDepartmentModel;
  Branches: IBranchModel;
  Units: IUnitModel;
  Structures: IStructureModel;
  Positions: IPositionModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Customers = db.model<ICustomerDocument, ICustomerModel>(
    'customers',
    loadCustomerClass(models),
  );

  models.Departments = db.model<IDepartmentDocument, IDepartmentModel>(
    'departments',
    loadDepartmentClass(models),
  );

  models.Branches = db.model<IBranchDocument, IBranchModel>(
    'branches',
    loadBranchClass(models),
  );

  models.Units = db.model<IUnitDocument, IUnitModel>(
    'units',
    loadUnitClass(models),
  );

  models.Structures = db.model<IStructureDocument, IStructureModel>(
    'structures',
    loadStructureClass(models),
  );

  models.Positions = db.model<IPositionDocument, IPositionModel>(
    'positions',
    loadPositionClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
