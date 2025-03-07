import {
  createGenerateModels,
  ICustomerDocument,
  IContext as IMainContext,
  IProductCategoryDocument,
  IProductConfigDocument,
  IProductDocument,
  IProductUomDocument,
} from 'erxes-api-utils';
import mongoose from 'mongoose';
import { ICustomerModel, loadCustomerClass } from './db/models/Customers';
import { IProductModel, loadProductClass } from './db/models/products/Product';
import {
  IProductCategoryModel,
  loadProductCategoryClass,
} from './db/models/products/ProductCategory';
import {
  IProductConfigModel,
  loadProductConfigClass,
} from './db/models/products/ProductsConfig';
import {
  IProductUomModel,
  loadProductUomClass,
} from './db/models/products/ProductsUom';

export interface IModels {
  // Contacts
  Customers: ICustomerModel;

  // Products
  Products: IProductModel;
  Uoms: IProductUomModel;
  ProductsConfigs: IProductConfigModel;
  ProductCategories: IProductCategoryModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export const loadClasses = (
  db: mongoose.Connection,
  subdomain: string,
): IModels => {
  const models = {} as IModels;

  models.Customers = db.model<ICustomerDocument, ICustomerModel>(
    'customers',
    loadCustomerClass(models),
  );

  models.Products = db.model<IProductDocument, IProductModel>(
    'products',
    loadProductClass(models, subdomain),
  );

  models.Uoms = db.model<IProductUomDocument, IProductUomModel>(
    'uoms',
    loadProductUomClass(models, subdomain),
  );

  models.ProductsConfigs = db.model<
    IProductConfigDocument,
    IProductConfigModel
  >('products_configs', loadProductConfigClass(models));

  models.ProductCategories = db.model<
    IProductCategoryDocument,
    IProductCategoryModel
  >('product_categories', loadProductCategoryClass(models));

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
