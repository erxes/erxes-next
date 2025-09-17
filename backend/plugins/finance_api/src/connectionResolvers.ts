import { ISavingDocument } from '@/saving/@types/saving';
import { IMainContext } from 'erxes-api-shared/core-types';
import { createGenerateModels } from 'erxes-api-shared/utils';
import mongoose from 'mongoose';
import { IContractTypeDocument } from '~/modules/saving/@types/contractTypes';
import {
  IContractTypeModel,
  loadContractTypeClass,
} from '~/modules/saving/db/models/contractTypeModel';

import { ISavingModel, loadSavingClass } from '@/saving/db/models/Saving';
import {
  IConfigModels,
  loadClass as loadConfigClass,
} from '~/modules/config/resolver';
import {
  ILoanModels,
  loadClass as loadLoanClass,
} from '~/modules/loan/resolver';
import {
  IPlanModels,
  loadClass as loadPlanClass,
} from '~/modules/plan/resolver';

export interface IModels extends ILoanModels, IConfigModels, IPlanModels {
  Saving: ISavingModel;
  ContractTypes: IContractTypeModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Saving = db.model<ISavingDocument, ISavingModel>(
    'saving',
    loadSavingClass(models),
  );

  models.ContractTypes = db.model<IContractTypeDocument, IContractTypeModel>(
    'saving_contract_types',
    loadContractTypeClass(models),
  );

  loadLoanClass(models, db);
  loadConfigClass(models, db);
  loadPlanClass(models, db);

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
