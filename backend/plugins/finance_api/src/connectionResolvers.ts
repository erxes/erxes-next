import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { ISavingDocument } from '@/saving/@types/saving';
import {
  IContractTypeModel,
  loadContractTypeClass,
} from '~/modules/saving/db/models/ContractType';
import { IContractTypeDocument } from '~/modules/saving/@types/contractTypes';
import mongoose from 'mongoose';

import { loadSavingClass, ISavingModel } from '@/saving/db/models/Saving';
import { IBlockModel, loadBlockClass } from '~/modules/saving/db/models/Block';
import { IPeriodLockDocument } from '~/modules/saving/@types/periodLockTypes';
import {
  IPeriodLockModel,
  loadPeriodLock,
} from '~/modules/saving/db/models/PeriodLock';
import {
  IContractModel,
  loadContract,
} from '~/modules/saving/db/models/Contract';
import {
  ITransactionModel,
  loadTransactionClass,
} from '~/modules/saving/db/models/Transaction';
import { IStoredInterestModel } from '~/modules/saving/db/models/StoredInterest';
import { IBlockDocument } from '~/modules/saving/@types/blockTypes';
import { ITransactionDocument } from '~/modules/saving/@types/transactions';

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

  models.Contracts = db.model<IContractTypeDocument, IContractModel>(
    'saving_contract',
    loadContract(models),
  );

  models.Blocks = db.model<IBlockDocument, IBlockModel>(
    'saving_block',
    loadBlockClass(models),
  );

  models.Transactions = db.model<ITransactionDocument, ITransactionModel>(
    'saving_transaction',
    loadTransactionClass(models),
  );

  models.PeriodLocks = db.model<IPeriodLockDocument, IPeriodLockModel>(
    'saving_period_lock',
    loadPeriodLock(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
