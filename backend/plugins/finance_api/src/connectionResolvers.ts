import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { ISavingDocument } from '@/saving/@types/saving';
import {
  IContractTypeModel,
  loadContractTypeClass,
} from '~/modules/saving/db/models/contractTypeModel';
import { IContractTypeDocument } from '~/modules/saving/@types/contractTypes';
import mongoose from 'mongoose';

import { loadSavingClass, ISavingModel } from '@/saving/db/models/Saving';

export interface IModels {
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

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
