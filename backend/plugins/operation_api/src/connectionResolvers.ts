import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { ITaskDocument } from '@/task/@types/task';
import { ITeamDocument } from '@/team/@types/team';

import mongoose from 'mongoose';

import { loadTaskClass, ITaskModel } from '@/task/db/models/task';
import { loadTeamClass, ITeamModel } from '@/team/db/models/team';
import { loadStatusClass, IStatusModel } from '@/status/db/models/status';
import { IStatusDocument } from '@/status/@types/status';

export interface IModels {
  Task: ITaskModel;
  Team: ITeamModel;
  Status: IStatusModel;
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

  models.Team = db.model<ITeamDocument, ITeamModel>(
    'operation_teams',
    loadTeamClass(models),
  );

  models.Status = db.model<IStatusDocument, IStatusModel>(
    'operation_statuses',
    loadStatusClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
