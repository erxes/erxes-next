import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { ITaskDocument } from '@/task/@types/task';

import mongoose from 'mongoose';

import { loadTaskClass, ITaskModel } from '@/task/db/models/task';

export interface IModels {
  Task: ITaskModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Task = db.model<ITaskDocument, ITaskModel>(
    'operation_tasks',
    loadTaskClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
