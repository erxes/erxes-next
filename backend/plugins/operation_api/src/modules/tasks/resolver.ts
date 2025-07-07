import mongoose from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IBoardDocument } from '~/modules/tasks/@types/boards';
import {
  IChecklistDocument,
  IChecklistItemDocument,
} from '~/modules/tasks/@types/checklists';
import { IPipelineLabelDocument } from '~/modules/tasks/@types/labels';
import { IPipelineDocument } from '~/modules/tasks/@types/pipelines';
import { IStageDocument } from '~/modules/tasks/@types/stages';
import { ITaskDocument } from '~/modules/tasks/@types/tasks';
import { IBoardModel, loadBoardClass } from '~/modules/tasks/db/models/Boards';
import {
  IChecklistItemModel,
  IChecklistModel,
  loadChecklistClass,
  loadChecklistItemClass,
} from '~/modules/tasks/db/models/Checklists';
import {
  IPipelineLabelModel,
  loadPipelineLabelClass,
} from '~/modules/tasks/db/models/Labels';
import {
  IPipelineModel,
  loadPipelineClass,
} from '~/modules/tasks/db/models/Pipelines';
import { IStageModel, loadStageClass } from '~/modules/tasks/db/models/Stages';
import { ITaskModel, loadTaskClass } from '~/modules/tasks/db/models/Tasks';

export const loadTaskClasses = (models: IModels, db: mongoose.Connection) => {
  models.Boards = db.model<IBoardDocument, IBoardModel>(
    'tasks_boards',
    loadBoardClass(models),
  );

  models.Pipelines = db.model<IPipelineDocument, IPipelineModel>(
    'tasks_pipelines',
    loadPipelineClass(models),
  );

  models.Stages = db.model<IStageDocument, IStageModel>(
    'tasks_stages',
    loadStageClass(models),
  );

  models.Tasks = db.model<ITaskDocument, ITaskModel>(
    'tasks',
    loadTaskClass(models),
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

  return models;
};
