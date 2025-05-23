import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { ILeactureDocument } from '@/leacture/@types/leacture';

import mongoose from 'mongoose';

import { loadLeactureClass, ILeactureModel } from '@/leacture/db/models/leacture';

export interface IModels {
  Leacture: ILeactureModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Leacture = db.model<ILeactureDocument, ILeactureModel>(
    'leacture',
    loadLeactureClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
