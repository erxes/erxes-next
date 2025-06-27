import { Model, Connection } from 'mongoose';

import { IMainContext } from 'erxes-api-shared/core-types';
import { createGenerateModels } from 'erxes-api-shared/utils';
import {
  automationExecutionSchema,
  automationSchema,
  IAutomationDocument,
  IAutomationExecutionDocument,
} from 'erxes-api-shared/core-modules';

export interface IModels {
  Automations: Model<IAutomationDocument>;
  Executions: Model<IAutomationExecutionDocument>;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export const loadClasses = (db: Connection, subdomain: string): IModels => {
  const models = {} as IModels;

  models.Automations = db.model<
    IAutomationDocument,
    Model<IAutomationDocument>
  >('automations', automationSchema);

  models.Executions = db.model<
    IAutomationExecutionDocument,
    Model<IAutomationExecutionDocument>
  >('automations_executions', automationExecutionSchema);

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
