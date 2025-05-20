import * as mongoose from 'mongoose';
// import { IContext as IMainContext } from '@erxes/api-utils/src';
import {
  IAutomationModel,
  loadClass as loadAutomationClass,
} from './models/Automations';
import { IAutomationDocument } from './definitions/automations';
import { IExecutionDocument } from './definitions/executions';
import {
  IExecutionModel,
  loadClass as loadExecutionClass,
} from './models/Executions';
import { INoteDocument } from './definitions/notes';
import { INoteModel, loadClass as loadNoteClass } from './models/Notes';
import { IMainContext } from 'erxes-api-shared/core-types';
import { createGenerateModels } from 'erxes-api-shared/utils';

export interface IModels {
  Automations: IAutomationModel;
  Executions: IExecutionModel;
  Notes: INoteModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export const loadClasses = (
  db: mongoose.Connection,
  subdomain: string,
): IModels => {
  const models = {} as IModels;

  models.Automations = db.model<IAutomationDocument, IAutomationModel>(
    'automations',
    loadAutomationClass(models),
  );

  models.Executions = db.model<IExecutionDocument, IExecutionModel>(
    'automations_executions',
    loadExecutionClass(models),
  );
  models.Notes = db.model<INoteDocument, INoteModel>(
    'automations_notes',
    loadNoteClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
