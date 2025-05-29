import { IMainContext } from 'erxes-api-shared/core-types';
import { createGenerateModels } from 'erxes-api-shared/utils';

import mongoose from 'mongoose';

import {
  IArticleDocument,
  ICategoryDocument,
  ITopicDocument,
} from '@/knowledgebase/@types/knowledgebase';
import {
  IArticleModel,
  ICategoryModel,
  ITopicModel,
  loadArticleClass,
  loadCategoryClass,
  loadTopicClass,
} from '@/knowledgebase/db/models/Knowledgebase';
import { ICommentDocument } from '@/portal/@types/comment';
import { IPortalCompanyDocument } from '@/portal/@types/company';
import { INotificationDocument } from '@/portal/@types/notification';
import { IPortalDocument } from '@/portal/@types/portal';
import { IUserDocument } from '@/portal/@types/user';
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

  KnowledgeBaseArticles: IArticleModel;
  KnowledgeBaseCategories: ICategoryModel;
  KnowledgeBaseTopics: ITopicModel;
}

export interface IContext extends IMainContext {
  commonQuerySelector: any;
  models: IModels;
  portalUser: IUserDocument;
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

  models.KnowledgeBaseArticles = db.model<IArticleDocument, IArticleModel>(
    'knowledgebase_articles',
    loadArticleClass(models),
  );

  models.KnowledgeBaseCategories = db.model<ICategoryDocument, ICategoryModel>(
    'knowledgebase_categories',
    loadCategoryClass(models),
  );

  models.KnowledgeBaseTopics = db.model<ITopicDocument, ITopicModel>(
    'knowledgebase_topics',
    loadTopicClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
