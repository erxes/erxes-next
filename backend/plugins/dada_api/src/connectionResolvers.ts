import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { ILlDocument } from '@/ll/@types/ll';

import mongoose from 'mongoose';

import { loadLlClass, ILlModel } from '@/ll/db/models/ll';

export interface IModels {
  Ll: ILlModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Ll = db.model<ILlDocument, ILlModel>(
    'll',
    loadLlClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
