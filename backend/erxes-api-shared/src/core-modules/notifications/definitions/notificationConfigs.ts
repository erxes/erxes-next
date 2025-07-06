import { Document, Schema } from 'mongoose';

// Default notification configuration (set by owner/admin)
export interface INotificationConfigDocument extends Document {
  _id: string;

  // Notification settings
  inAppNotificationsDisabled: boolean;
  emailNotificationsDisabled: boolean;

  // Email template (if email enabled)
  emailTemplateId?: string;
  emailSubject?: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // user ID
}

const orgNotifTypeSettingsScheam = new Schema(
  {
    inAppDisabled: { type: Boolean },
    emailDisabled: { type: Boolean },
    emailTemplateId: {
      type: String,
    },

    emailSubject: {
      type: String,
      maxlength: 200,
    },
  },
  { _id: false },
);

const PluginSettingsSchema = new Schema(
  {
    enabled: { type: Boolean }, // disable entire plugin notifications
    inAppDisabled: { type: Boolean },
    emailDisabled: { type: Boolean },
    types: {
      type: Map,
      of: orgNotifTypeSettingsScheam,
      default: {},
    },
  },
  { _id: false },
);

export const notificationConfigSchema = new Schema({
  plugins: {
    type: Map,
    of: PluginSettingsSchema,
    default: {},
  },

  inAppNotificationsDisabled: {
    type: Boolean,
    default: false,
  },

  emailNotificationsDisabled: {
    type: Boolean,
    default: false,
  },

  emailTemplateId: {
    type: String,
  },

  emailSubject: {
    type: String,
    maxlength: 200,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },

  createdBy: {
    type: String,
    required: true,
  },
});

// Unique constraint on contentType + action
notificationConfigSchema.index({ contentType: 1, action: 1 }, { unique: true });
notificationConfigSchema.index({ enabled: 1 });
