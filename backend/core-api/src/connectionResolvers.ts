import {
  createGenerateModels,
  ICustomerDocument,
  IAppDocument,
  IBrandDocument,
  ICompanyDocument,
  IClientDocument,
  IConfigDocument,
  IConformityDocument,
  IActivityLogDocument,
  IEmailDeliveriesDocument,
  IEmailTemplateDocument,
  IExchangeRateDocument,
  IContext as IMainContext,
} from 'erxes-api-utils';
import mongoose from 'mongoose';
import { ICustomerModel, loadCustomerClass } from './db/models/Customers';
import { IAppModel, loadAppClass } from './db/models/Apps';
import { IBrandModel, loadBrandClass } from './db/models/Brands';
import { ICompanyModel, loadCompanyClass } from './db/models/Companies';
import { IClientModel, loadClientClass } from './db/models/Client';
import { IConfigModel, loadConfigClass } from './db/models/Configs';
import {
  IConformityModel,
  loadConformityClass,
} from './db/models/Conformities';
import {
  IActivityLogModel,
  loadActivityLogClass,
} from './db/models/ActivityLogs';
import {
  IEmailDeliveryModel,
  loadEmailDeliveryClass,
} from './db/models/EmailDeliveries';
import {
  IEmailTemplateModel,
  loadEmailTemplateClass,
} from './db/models/EmailTemplates';
import {
  IExchangeRateModel,
  loadExchangeRateClass,
} from './db/models/ExchangeRates';
export interface IModels {
  // Users: IUserModel;
  Brands: IBrandModel;
  Conformities: IConformityModel;
  Configs: IConfigModel;
  // Permissions: IPermissionModel;
  // UsersGroups: IUserGroupModel;
  // RobotEntries: IRobotEntryModel;
  // OnboardingHistories: IOnboardingHistoryModel;
  // Structures: IStructureModel;
  // Departments: IDepartmentModel;
  // Units: IUnitModel;
  // Branches: IBranchModel;
  // Positions: IPositionModel;
  Apps: IAppModel;
  // InstallationLogs: IInstallationLogModel;
  // UserMovements: IUserMovemmentModel;
  // Tags: ITagModel;
  // InternalNotes: IInternalNoteModel;
  // Visitors: IVisitorModel;
  ActivityLogs: IActivityLogModel;
  // Logs: ILogModel;
  EmailDeliveries: IEmailDeliveryModel;
  // Segments: ISegmentModel;
  // Fields: IFieldModel;
  // FieldsGroups: IFieldGroupModel;
  // Forms: IFormModel;
  // FormSubmissions: IFormSubmissionModel;
  Customers: ICustomerModel;
  Companies: ICompanyModel;
  // Products: IProductModel;
  // ProductCategories: IProductCategoryModel;
  // ProductsConfigs: IProductsConfigModel;
  // Uoms: IUomModel;
  EmailTemplates: IEmailTemplateModel;
  // Dashboards: IDashboardModel;
  // Sections: ISectionModel;
  // Charts: IChartModel;
  // Reports: IReportModel;
  Clients: IClientModel;
  ExchangeRates: IExchangeRateModel;
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
    loadCustomerClass(models, subdomain),
  );
  models.Apps = db.model<IAppDocument, IAppModel>('apps', loadAppClass(models));

  models.Brands = db.model<IBrandDocument, IBrandModel>(
    'brands',
    loadBrandClass(models),
  );
  models.Clients = db.model<IClientDocument, IClientModel>(
    'clients',
    loadClientClass(models),
  );
  models.Companies = db.model<ICompanyDocument, ICompanyModel>(
    'companies',
    loadCompanyClass(models, subdomain),
  );
  models.Configs = db.model<IConfigDocument, IConfigModel>(
    'configs',
    loadConfigClass(models),
  );
  models.Conformities = db.model<IConformityDocument, IConformityModel>(
    'conformity',
    loadConformityClass(models, subdomain),
  );
  models.ActivityLogs = db.model<IActivityLogDocument, IActivityLogModel>(
    'activity_logs',
    loadActivityLogClass(models, subdomain),
  );
  models.EmailDeliveries = db.model<
    IEmailDeliveriesDocument,
    IEmailDeliveryModel
  >('email_deliveries', loadEmailDeliveryClass(models));
  models.EmailTemplates = db.model<IEmailTemplateDocument, IEmailTemplateModel>(
    'email_templates',
    loadEmailTemplateClass(models),
  );
  models.ExchangeRates = db.model<IExchangeRateDocument, IExchangeRateModel>(
    'exchange_rates',
    loadExchangeRateClass(models, subdomain),
  );
  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
