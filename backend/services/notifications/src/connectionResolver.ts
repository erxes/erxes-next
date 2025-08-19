import { Model, Connection } from 'mongoose';

import { IMainContext } from 'erxes-api-shared/core-types';
import { createGenerateModels } from 'erxes-api-shared/utils';
import {
  emailDeliverySchema,
  IEmailDeliveryDocument,
  INotificationConfigDocument,
  INotificationDocument,
  IUserNotificationSettingsDocument,
  notificationConfigSchema,
  notificationSchema,
  userNotificationSettingsSchema,
} from 'erxes-api-shared/core-modules';

export interface IModels {
  Notifications: Model<INotificationDocument>;
  NotificationConfigs: Model<INotificationConfigDocument>;
  UserNotificationSettings: Model<IUserNotificationSettingsDocument>;
  EmailDeliveries: Model<IEmailDeliveryDocument>;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export const loadClasses = (db: Connection, subdomain: string): IModels => {
  const models = {} as IModels;

  models.Notifications = db.model<
    INotificationDocument,
    Model<INotificationDocument>
  >('notifications', notificationSchema);

  models.NotificationConfigs = db.model<
    INotificationConfigDocument,
    Model<INotificationConfigDocument>
  >('notification_configs', notificationConfigSchema);

  models.UserNotificationSettings = db.model<
    IUserNotificationSettingsDocument,
    Model<IUserNotificationSettingsDocument>
  >('user_notification_settings', userNotificationSettingsSchema);

  models.EmailDeliveries = db.model<
    IEmailDeliveryDocument,
    Model<IEmailDeliveryDocument>
  >('email_deliveries', emailDeliverySchema);

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
