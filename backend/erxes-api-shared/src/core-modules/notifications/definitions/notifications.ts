import { Document, Schema } from 'mongoose';

// Notification schema for in-app notifications
export interface INotificationDocument extends Document {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';

  // Recipients and sender
  userId: string;
  fromUserId?: string;

  // Source information for plugin widgets
  contentType: string; // 'frontline:conversation', 'sales:deal', etc.
  contentTypeId?: string; // target object ID

  // Status
  isRead: boolean;
  readAt?: Date;

  // Additional data
  priority: 'low' | 'medium' | 'high' | 'urgent';
  priorityLevel: 1 | 2 | 3 | 4;
  metadata?: any; // plugin-specific data
  action?: string;

  // Timestamps
  createdAt: Date;
  expiresAt?: Date; // Auto-cleanup old notifications
  isArchived: Boolean;
}

export const notificationSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },

  message: {
    type: String,
    required: true,
    maxlength: 1000,
  },

  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    required: true,
  },

  userId: {
    type: String,
    required: true,
    index: true,
  },

  fromUserId: {
    type: String,
  },

  contentType: {
    type: String,
    required: true,
  },

  contentTypeId: {
    type: String,
  },

  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },

  readAt: {
    type: Date,
  },

  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  priorityLevel: {
    type: String,
    enum: [1, 2, 3, 4],
    default: 2,
    required: true,
  },

  metadata: {
    type: Schema.Types.Mixed,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },

  expiresAt: {
    type: Date,
    index: true,
  },
  isArchived: {
    type: Boolean,
    index: true,
  },
  action: {
    type: String,
    index: true,
    optional: true,
  },
});

// Compound indexes for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ contentType: 1, contentTypeId: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // MongoDB TTL index
