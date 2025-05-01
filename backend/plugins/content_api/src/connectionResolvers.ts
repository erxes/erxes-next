import { IMainContext, IUserDocument } from 'erxes-api-shared/core-types';
import { createGenerateModels } from 'erxes-api-shared/utils';

import mongoose from 'mongoose';

import { ICommentDocument } from '@/portal/@types/comment';
import { IPortalCompanyDocument } from '@/portal/@types/company';
import { INotificationDocument } from '@/portal/@types/notification';
import { IPortalDocument } from '@/portal/@types/portal';
import { IUserCardDocument } from '@/portal/@types/userCard';
import { ICommentModel, loadCommentClass } from '@/portal/db/models/Comment';
import {
  IPortalCompanyModel,
  loadCompanyClass,
} from '@/portal/db/models/company';
import {
  INotificationModel,
  loadNotificationClass,
} from '@/portal/db/models/Notifications';
import { IPortalModel, loadPortalClass } from '@/portal/db/models/Portals';
import { IUserModel, loadUserClass } from '@/portal/db/models/Users';
import {
  IUserCardModel,
  loadUserCardClass,
} from '@/portal/db/models/UsersCards';

export interface IModels {
  Portals: IPortalModel;
  Notifications: INotificationModel;
  Users: IUserModel;
  UserCards: IUserCardModel;
  Comments: ICommentModel;
  Companies: IPortalCompanyModel;
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

  models.UserCards = db.model<IUserCardDocument, IUserCardModel>(
    'client_portal_user_cards',
    loadUserCardClass(models),
  );

  models.Comments = db.model<ICommentDocument, ICommentModel>(
    'client_portal_comments',
    loadCommentClass(models),
  );

  models.Companies = db.model<IPortalCompanyDocument, IPortalCompanyModel>(
    'client_portal_companies',
    loadCompanyClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
