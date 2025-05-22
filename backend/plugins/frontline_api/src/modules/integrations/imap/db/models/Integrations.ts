import { Model } from 'mongoose';
import { IMapIntegrationDocument} from '@/integrations/imap/@types/integrations';
import { integrationSchema } from '@/integrations/imap/db/definitions/integrations'
export type IMapIntegrationModel = Model<IMapIntegrationDocument>;

export const loadImapIntegrationClass = (models) => {
  class Integration {}

  integrationSchema.loadClass(Integration);

  return integrationSchema;
};