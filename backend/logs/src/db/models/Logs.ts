import { Model } from 'mongoose';
import { ILogDocument, logsSchema } from '../definitions/logs';

export interface ILogModel extends Model<ILogDocument> {}

export const loadLogsClass = (models) => {
  class Logs {}

  logsSchema.loadClass(Logs);

  return logsSchema;
};
