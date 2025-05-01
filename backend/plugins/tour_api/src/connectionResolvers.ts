import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { ISampleDocument } from '@/sample/@types/sample';

import mongoose from 'mongoose';

import { loadSampleClass, ISampleModel } from '@/sample/db/models/Sample';

export interface IModels {
  Samples: ISampleModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Samples = db.model<ISampleDocument, ISampleModel>(
    'sample',
    loadSampleClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
