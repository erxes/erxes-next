import { IUserDocument } from 'erxes-core-types';
import { createGenerateModels } from 'erxes-api-utils';
import mongoose from 'mongoose';
import {
  ICompanyDocument,
  IUserMovementDocument,
  ICustomerDocument,
} from 'erxes-core-types';

import {
  ICompanyModel,
  loadCompanyClass,
} from './modules/contacts/db/models/Companies';
import {
  ICustomerModel,
  loadCustomerClass,
} from './modules/contacts/db/models/Customers';
import {
  IUserModel,
  IUserMovemmentModel,
  loadUserClass,
  loadUserMovemmentClass,
} from './modules/organization/team-member/db/models/Users';
import { IProductCategoryDocument } from './modules/products/@types/category';
import { IProductsConfigDocument } from './modules/products/@types/config';
import { IProductDocument } from './modules/products/@types/product';
import { IUomDocument } from './modules/products/@types/uom';
import {
  IProductCategoryModel,
  loadProductCategoryClass,
} from './modules/products/db/models/Categories';
import {
  IProductsConfigModel,
  loadProductsConfigClass,
} from './modules/products/db/models/Configs';
import {
  IProductModel,
  loadProductClass,
} from './modules/products/db/models/Products';
import { IUomModel, loadUomClass } from './modules/products/db/models/Uoms';
import { IConfigDocument } from './modules/settings/db/definitions/configs';
import { IConfigModel } from './modules/settings/db/models/Configs';

export interface IModels {
  Customers: ICustomerModel;
  Companies: ICompanyModel;
  Users: IUserModel;
  UserMovements: IUserMovemmentModel;
  Configs: IConfigModel;
  Products: IProductModel;
  ProductCategories: IProductCategoryModel;
  ProductsConfigs: IProductsConfigModel;
  Uoms: IUomModel;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Users = db.model<IUserDocument, IUserModel>(
    'users',
    loadUserClass(models),
  );

  models.Customers = db.model<ICustomerDocument, ICustomerModel>(
    'customers',
    loadCustomerClass(models),
  );

  models.Companies = db.model<ICompanyDocument, ICompanyModel>(
    'companies',
    loadCompanyClass(models),
  );

  models.UserMovements = db.model<IUserMovementDocument, IUserMovemmentModel>(
    'user_movements',
    loadUserMovemmentClass(models),
  );

  models.Configs = db.model<IConfigDocument, IConfigModel>(
    'configs',
    loadUserMovemmentClass(models),
  );

  models.Products = db.model<IProductDocument, IProductModel>(
    'products',
    loadProductClass(models),
  );

  models.Uoms = db.model<IUomDocument, IUomModel>('uoms', loadUomClass(models));

  models.ProductsConfigs = db.model<
    IProductsConfigDocument,
    IProductsConfigModel
  >('products_configs', loadProductsConfigClass(models));

  models.ProductCategories = db.model<
    IProductCategoryDocument,
    IProductCategoryModel
  >('product_categories', loadProductCategoryClass(models));

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
