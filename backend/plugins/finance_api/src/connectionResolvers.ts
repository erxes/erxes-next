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
import { IBlockModel } from '~/modules/saving/db/models/blocksModel';
import { IPeriodLock } from '~/modules/saving/@types/periodLockTypes';
import { IPeriodLockModel } from '~/modules/saving/db/models/periodLockModel';
import { IContractModel } from '~/modules/saving/db/models/contractModel';
import { ITransactionModel } from '~/modules/saving/db/models/transactionModel';
import { IStoredInterest } from '~/modules/saving/@types/storedInterest';
import { IStoredInterestModel } from '~/modules/saving/db/models/storedInterestModel';

export interface IModels {
  Saving: ISavingModel;
  ContractTypes: IContractTypeModel;
  Blocks: IBlockModel;
  PeriodLocks: IPeriodLockModel;
  Contracts: IContractModel;
  Transactions: ITransactionModel;
  StoredInterest: IStoredInterestModel;
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
