import mongoose from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IBoardDocument } from '~/modules/tickets/@types/board';
import {
  IChecklistDocument,
  IChecklistItemDocument,
} from '~/modules/tickets/@types/checklist';
import { ICommentDocument } from '~/modules/tickets/@types/comment';
import { IPipelineLabelDocument } from '~/modules/tickets/@types/label';
import { IPipelineDocument } from '~/modules/tickets/@types/pipeline';
import { IStageDocument } from '~/modules/tickets/@types/stage';
import { ITicketDocument } from '~/modules/tickets/@types/ticket';
import {
  IBoardModel,
  loadBoardClass,
} from '~/modules/tickets/db/models/Boards';
import {
  IChecklistItemModel,
  IChecklistModel,
  loadChecklistClass,
  loadChecklistItemClass,
} from '~/modules/tickets/db/models/Checklists';
import {
  ICommentModel,
  loadCommentClass,
} from '~/modules/tickets/db/models/Comments';
import {
  IPipelineLabelModel,
  loadPipelineLabelClass,
} from '~/modules/tickets/db/models/Labels';
import {
  IPipelineModel,
  loadPipelineClass,
} from '~/modules/tickets/db/models/Pipelines';
import {
  IStageModel,
  loadStageClass,
} from '~/modules/tickets/db/models/Stages';
import {
  ITicketModel,
  loadTicketClass,
} from '~/modules/tickets/db/models/Tickets';

export const loadClasses = (models: IModels, db: mongoose.Connection) => {
  models.Boards = db.model<IBoardDocument, IBoardModel>(
    'tickets_boards',
    loadBoardClass(models),
  );

  models.Pipelines = db.model<IPipelineDocument, IPipelineModel>(
    'tickets_pipelines',
    loadPipelineClass(models),
  );

  models.Stages = db.model<IStageDocument, IStageModel>(
    'tickets_stages',
    loadStageClass(models),
  );

  models.Tickets = db.model<ITicketDocument, ITicketModel>(
    'tickets',
    loadTicketClass(models),
  );

  models.CheckLists = db.model<IChecklistDocument, IChecklistModel>(
    'tickets_checklists',
    loadChecklistClass(models),
  );

  models.CheckListItems = db.model<IChecklistItemDocument, IChecklistItemModel>(
    'tickets_checklist_items',
    loadChecklistItemClass(models),
  );

  models.PipelineLabels = db.model<IPipelineLabelDocument, IPipelineLabelModel>(
    'tickets_pipeline_labels',
    loadPipelineLabelClass(models),
  );

  models.Comments = db.model<ICommentDocument, ICommentModel>(
    'ticket_comments',
    loadCommentClass(models),
  );

  return models;
};
