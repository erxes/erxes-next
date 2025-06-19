import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { ITasksDocument } from '@/tasks/@types/tasks';

import mongoose from 'mongoose';

import { loadTasksClass, ITasksModel } from '@/tasks/db/models/Tasks';

export interface IModels {
  Tasks: ITasksModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Tasks = db.model<ITasksDocument, ITasksModel>(
    'tasks',
    loadTasksClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
