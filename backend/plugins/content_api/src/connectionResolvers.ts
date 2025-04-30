import { IMainContext, IUserDocument } from 'erxes-api-shared/core-types';
import { createGenerateModels } from 'erxes-api-shared/utils';

import mongoose from 'mongoose';

import { IPortalDocument } from '@/portal/@types/portal';
import { INotificationDocument } from '@/portal/@types/notification';
import { IPortalModel, loadPortalClass } from '@/portal/db/models/Portals';
import { IUserModel, loadUserClass } from '@/portal/db/models/Users';
import {
  INotificationModel,
  loadNotificationClass,
} from '@/portal/db/models/Notifications';

export interface IModels {
  Portals: IPortalModel;
  Notifications: INotificationModel;
  Users: IUserModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Portals = db.model<IPortalDocument, IPortalModel>(
    'client_portals',
    loadPortalClass(models),
  );

  models.Notifications = db.model<INotificationDocument, INotificationModel>(
    'client_portal_notifications',
    loadNotificationClass(models),
  );

  models.Users = db.model<IUserDocument, IUserModel>(
    'client_portal_users',
    loadUserClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
