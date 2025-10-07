import { EMAPPEARANCE_SCHEMA } from '@/integrations/erxes-messenger/constants/emAppearanceSchema';
import { z } from 'zod';

export interface IIntegration {
  _id: string;
  name: string;
  kind: string;
  brandId: string;
  brand?: {
    code: string;
  };
  channelIds?: string[];
  channels?: { _id: string }[];
}
export type IUiOptions = z.infer<typeof EMAPPEARANCE_SCHEMA>;

export interface IIntegrationDetail extends IIntegration {
  languageCode?: string;
  code?: string;
  tagIds?: string[];
  createdAt?: string;
  leadData?: string;
  messengerData?: string;
  uiOptions?: IUiOptions;
  isConnected?: boolean;
  departmentIds?: string[];
  details?: any;
  callData?: any;
  isActive: boolean;
  healthStatus: {
    status: 'healthy' | string;
  };
}

export interface IIntegrationType {
  _id: string;
  name: string;
}
