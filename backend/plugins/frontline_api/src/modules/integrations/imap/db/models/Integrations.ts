import { Model } from 'mongoose';
import { IIMapIntegrationDocument} from '@/integrations/imap/@types/integrations';
import { integrationSchema } from '@/integrations/imap/db/definitions/integrations'
export type IIMapIntegrationModel = Model<IIMapIntegrationDocument>;

export const loadImapIntegrationClass = (models) => {
  class Integration {}

  integrationSchema.loadClass(Integration);

  return integrationSchema;
};