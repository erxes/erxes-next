import { CREATE_TOKEN_SCHEMA } from '@/settings/apps/schema';
import { z } from 'zod';

export interface IApp {
  _id: string;
  accessToken: string;
  allowAllPermission: boolean;
  createdAt: Date;
  expireDate: Date;
  isEnabled: boolean;
  name: string;
  noExpire: boolean;
  refreshToken: string;
  userGroupId: string;
}

export type TCreateAppForm = z.infer<typeof CREATE_TOKEN_SCHEMA>;
