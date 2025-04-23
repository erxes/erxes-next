import { createGenerateModels } from 'erxes-api-shared/utils';
import {
  IBrandDocument,
  ICompanyDocument,
  ICustomerDocument,
  IUserDocument,
  IUserMovementDocument,
} from 'erxes-api-shared/core-types';
import mongoose from 'mongoose';

import { ITagDocument } from 'erxes-api-shared/core-types';
import {
  IProductCategoryDocument,
  IProductDocument,
  IProductsConfigDocument,
  IUomDocument,
} from 'erxes-api-shared/core-types';
import {
  ICompanyModel,
  loadCompanyClass,
} from '@/contacts/db/models/Companies';
import {
  ICustomerModel,
  loadCustomerClass,
} from '@/contacts/db/models/Customers';
import {
  IUserModel,
  IUserMovemmentModel,
  loadUserClass,
  loadUserMovemmentClass,
} from '@/organization/team-member/db/models/Users';
import {
  IProductCategoryModel,
  loadProductCategoryClass,
} from '@/products/db/models/Categories';
import {
  IProductsConfigModel,
  loadProductsConfigClass,
} from '@/products/db/models/Configs';
import { IProductModel, loadProductClass } from '@/products/db/models/Products';
import { IUomModel, loadUomClass } from '@/products/db/models/Uoms';
import { IConfigDocument } from '@/settings/db/definitions/configs';
import { IConfigModel } from '@/settings/db/models/Configs';
import { ITagModel, loadTagClass } from '@/tags/db/models/Tags';
import { IMainContext } from 'erxes-api-shared/core-types';

import {
  IBranchDocument,
  IDepartmentDocument,
  IPositionDocument,
  IStructureDocument,
  IUnitDocument,
} from '@/organization/structure/@types/structure';
import { IAppModel, loadAppClass } from '@/apps/db/models/Apps';
import { IAppDocument } from 'erxes-api-shared/core-types';
import {
  IBranchModel,
  IDepartmentModel,
  IPositionModel,
  IStructureModel,
  IUnitModel,
  loadBranchClass,
  loadDepartmentClass,
  loadPositionClass,
  loadStructureClass,
  loadUnitClass,
} from '@/organization/structure/db/models/Structure';
import {
  IFieldGroupModel,
  IFieldModel,
  loadFieldClass,
  loadGroupClass,
} from './modules/forms/db/models/Fields';
import {
  IFormModel,
  IFormSubmissionModel,
  loadFormClass,
  loadFormSubmissionClass,
} from './modules/forms/db/models/Forms';
import {
  IFieldDocument,
  IFieldGroupDocument,
} from './modules/forms/db/definitions/fields';
import {
  IForm,
  IFormSubmissionDocument,
} from './modules/forms/db/definitions/forms';
import { ISegmentDocument } from './modules/segments/db/definitions/segments';
import {
  ISegmentModel,
  loadSegmentClass,
} from './modules/segments/db/models/Segments';
import {
  IConformityModel,
  loadConformityClass,
} from './modules/conformities/db/models/Conformities';
import { IConformityDocument } from './modules/conformities/db/definitions/conformities';
import { IBrandModel, loadBrandClass } from './modules/brands/db/models';

export interface IModels {
  Brands: IBrandModel;
  Customers: ICustomerModel;
  Companies: ICompanyModel;
  Users: IUserModel;
  UserMovements: IUserMovemmentModel;
  Configs: IConfigModel;
  Tags: ITagModel;
  Products: IProductModel;
  ProductCategories: IProductCategoryModel;
  ProductsConfigs: IProductsConfigModel;
  Uoms: IUomModel;
  Structures: IStructureModel;
  Departments: IDepartmentModel;
  Units: IUnitModel;
  Branches: IBranchModel;
  Positions: IPositionModel;
  Apps: IAppModel;
  Fields: IFieldModel;
  FieldsGroups: IFieldGroupModel;
  Forms: IFormModel;
  FormSubmissions: IFormSubmissionModel;
  Segments: ISegmentModel;
  Conformities: IConformityModel;
}

export interface IContext extends IMainContext {
  models: IModels;
  commonQuerySelector: any;
}

export const loadClasses = (
  db: mongoose.Connection,
  subdomain: string,
): IModels => {
  const models = {} as IModels;

  models.Users = db.model<IUserDocument, IUserModel>(
    'users',
    loadUserClass(models),
  );

  models.Brands = db.model<IBrandDocument, IBrandModel>(
    'brands',
    loadBrandClass(models),
  );

  models.Conformities = db.model<IConformityDocument, IConformityModel>(
    'conformity',
    loadConformityClass(models, subdomain),
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

  models.Tags = db.model<ITagDocument, ITagModel>('tags', loadTagClass(models));

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

  models.Structures = db.model<IStructureDocument, IStructureModel>(
    'structures',
    loadStructureClass(models),
  );
  models.Departments = db.model<IDepartmentDocument, IDepartmentModel>(
    'departments',
    loadDepartmentClass(models),
  );
  models.Units = db.model<IUnitDocument, IUnitModel>(
    'units',
    loadUnitClass(models),
  );
  models.Branches = db.model<IBranchDocument, IBranchModel>(
    'branches',
    loadBranchClass(models),
  );
  models.Positions = db.model<IPositionDocument, IPositionModel>(
    'positions',
    loadPositionClass(models),
  );
  models.Apps = db.model<IAppDocument, IAppModel>('apps', loadAppClass(models));

  models.Fields = db.model<IFieldDocument, IFieldModel>(
    'form_fields',
    loadFieldClass(models, subdomain),
  );
  models.FieldsGroups = db.model<IFieldGroupDocument, IFieldGroupModel>(
    'fields_groups',
    loadGroupClass(models),
  );
  models.Forms = db.model<IForm, IFormModel>('forms', loadFormClass(models));
  models.FormSubmissions = db.model<
    IFormSubmissionDocument,
    IFormSubmissionModel
  >('form_submissions', loadFormSubmissionClass(models));

  models.Segments = db.model<ISegmentDocument, ISegmentModel>(
    'segments',
    loadSegmentClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
