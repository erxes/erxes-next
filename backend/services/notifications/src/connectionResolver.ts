import { Connection, Model } from 'mongoose';

import {
  emailDeliverySchema,
  IEmailDeliveryDocument,
  INotificationDocument,
  notificationSchema,
} from 'erxes-api-shared/core-modules';
import { IMainContext } from 'erxes-api-shared/core-types';
import { createGenerateModels } from 'erxes-api-shared/utils';

export interface IModels {
  Notifications: Model<INotificationDocument>;
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

  models.EmailDeliveries = db.model<
    IEmailDeliveryDocument,
    Model<IEmailDeliveryDocument>
  >('email_deliveries', emailDeliverySchema);

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
