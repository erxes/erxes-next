import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { IcontentDocument } from '@/content/@types/content';

import mongoose from 'mongoose';

import { loadcontentClass, IcontentModel } from '@/content/db/models/content';

export interface IModels {
  contents: IcontentModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.contents = db.model<IcontentDocument, IcontentModel>(
    'content',
    loadcontentClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
