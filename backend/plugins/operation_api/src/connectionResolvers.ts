import { IMainContext } from 'erxes-api-shared/core-types';
import { createGenerateModels } from 'erxes-api-shared/utils';

import mongoose from 'mongoose';

import { ITaskModel } from '@/tasks/db/models/Tasks';
import { IBoardModel } from '~/modules/tasks/db/models/Boards';
import {
  IChecklistItemModel,
  IChecklistModel,
} from '~/modules/tasks/db/models/Checklists';
import { IPipelineLabelModel } from '~/modules/tasks/db/models/Labels';
import { IPipelineModel } from '~/modules/tasks/db/models/Pipelines';
import { IStageModel } from '~/modules/tasks/db/models/Stages';
import { loadTaskClasses } from '~/modules/tasks/resolver';

export interface IModels {
  // TASK MODULE
  Boards: IBoardModel;
  Pipelines: IPipelineModel;
  Stages: IStageModel;
  Tasks: ITaskModel;
  Checklists: IChecklistModel;
  ChecklistItems: IChecklistItemModel;
  PipelineLabels: IPipelineLabelModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  loadTaskClasses(models, db);

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
