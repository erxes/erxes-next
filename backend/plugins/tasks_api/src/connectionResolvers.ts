import { IMainContext, IUserDocument } from 'erxes-api-shared/core-types';
import { createGenerateModels } from 'erxes-api-shared/utils';

import mongoose from 'mongoose';
import { IBoardModel, loadBoardClass } from './modules/tasks/db/models/Boards';
import { IPipelineModel, loadPipelineClass } from './modules/tasks/db/models/Pipelines';
import { IPipelineDocument } from './modules/tasks/@types/pipeline';
import { IBoardDocument } from './modules/tasks/@types/board';
import { IStageDocument } from './modules/tasks/@types/stage';
import { IChecklistDocument, IChecklistItemDocument } from './modules/tasks/@types/checklist';
import { IChecklistItemModel, IChecklistModel, loadChecklistClass, loadChecklistItemClass } from './modules/tasks/db/models/Checklists';
import { IPipelineLabelModel, loadPipelineLabelClass } from './modules/tasks/db/models/Labels';
import { loadStageClass } from './modules/tasks/db/models/Stages';
import { IPipelineLabelDocument } from './modules/tasks/@types/label';
import { IStageModel } from './modules/tasks/db/models/Stages';


export interface IModels {
  [x: string]: any;
  Boards: IBoardModel;
  Pipelines: IPipelineModel;
  Stages: IStageModel;
  Checklists: IChecklistModel;
  ChecklistItems: IChecklistItemModel;
  PipelineLabels: IPipelineLabelModel;
  ChecklistDocument: IChecklistDocument;
}

export interface IContext extends IMainContext {
  users: IUserDocument;
  models: IModels;
  
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;
    
  models.Boards = db.model<IBoardDocument, IBoardModel>(
    'tasks_boards',
    loadBoardClass(models),
  );

  models.Pipelines = db.model<IPipelineDocument, IPipelineModel>(
    'tasks_pipelines',
    loadPipelineClass(models),
  );


  models.Checklists = db.model<IChecklistDocument, IChecklistModel>(
    'tasks_checklists',
    loadChecklistClass(models),
  );

  models.ChecklistItems = db.model<IChecklistItemDocument, IChecklistItemModel>(
    'tasks_checklist_items',
    loadChecklistItemClass(models),
  );

  models.PipelineLabels = db.model<IPipelineLabelDocument, IPipelineLabelModel>(
    'tasks_pipeline_labels',
    loadPipelineLabelClass(models),
  );

  models.Stages = db.model<IStageDocument, IStageModel>(
    "tasks_stages",
    loadStageClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);

export { IChecklistDocument };

