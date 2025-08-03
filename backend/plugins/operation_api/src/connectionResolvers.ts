import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { ITaskDocument } from '@/task/@types/task';
import { ITeamDocument, ITeamMemberDocument } from '@/team/@types/team';

import mongoose from 'mongoose';

import { loadTaskClass, ITaskModel } from '@/task/db/models/Task';
import { loadTeamClass, ITeamModel } from '@/team/db/models/Team';
import {
  loadTeamMemberClass,
  ITeamMemberModel,
} from '@/team/db/models/TeamMembers';
import { loadStatusClass, IStatusModel } from '@/status/db/models/Status';
import { IStatusDocument } from '@/status/@types/status';
import { loadProjectClass, IProjectModel } from '@/project/db/models/Project';
import { IProjectDocument } from '@/project/@types/project';

export interface IModels {
  Task: ITaskModel;
  Team: ITeamModel;
  TeamMember: ITeamMemberModel;
  Status: IStatusModel;
  Project: IProjectModel;
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

  models.TeamMember = db.model<ITeamMemberDocument, ITeamMemberModel>(
    'operation_team_members',
    loadTeamMemberClass(models),
  );

  models.Status = db.model<IStatusDocument, IStatusModel>(
    'operation_statuses',
    loadStatusClass(models),
  );

  models.Project = db.model<IProjectDocument, IProjectModel>(
    'operation_projects',
    loadProjectClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
