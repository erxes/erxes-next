import {
  attachmentSchema,
  customFieldSchema,
} from 'erxes-api-shared/core-modules';
import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';
import { TICKET_STATUSES, TIME_TRACK_TYPES } from '~/modules/tickets/constants';

const timeTrackSchema = new Schema(
  {
    startDate: { type: String },
    timeSpent: { type: Number },
    status: {
      type: String,
      enum: TIME_TRACK_TYPES.ALL,
      default: TIME_TRACK_TYPES.STOPPED,
    },
  },
  { _id: false },
);

const relationSchema = new Schema(
  {
    id: { type: String },
    start: { type: String },
    end: { type: String },
  },
  { _id: false },
);

export const ticketSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    parentId: { type: String, optional: true, label: 'Parent Id' },
    type: { type: String, optional: true, label: 'type' },
    userId: { type: String, optional: true, esType: 'keyword' },
    order: { type: Number, index: true },
    name: { type: String, label: 'Name' },
    startDate: { type: Date, label: 'Start date', esType: 'date' },
    closeDate: { type: Date, label: 'Close date', esType: 'date' },
    stageChangedDate: {
      type: Date,
      label: 'Stage changed date',
      esType: 'date',
    },
    reminderMinute: { type: Number, label: 'Reminder minute' },
    isComplete: {
      type: Boolean,
      default: false,
      label: 'Is complete',
      esType: 'boolean',
    },
    description: { type: String, optional: true, label: 'Description' },
    assignedUserIds: { type: [String], esType: 'keyword' },
    watchedUserIds: { type: [String], esType: 'keyword' },
    labelIds: { type: [String], esType: 'keyword' },
    attachments: { type: [attachmentSchema], label: 'Attachments' },
    stageId: { type: String, index: true },
    initialStageId: {
      type: String,
      optional: true,
    },
    modifiedBy: { type: String, esType: 'keyword' },
    searchText: { type: String, optional: true, index: true },
    priority: { type: String, optional: true, label: 'Priority' },
    // TODO remove after migration
    sourceConversationId: { type: String, optional: true },
    sourceConversationIds: { type: [String], optional: true },
    timeTrack: {
      type: timeTrackSchema,
    },
    status: {
      type: String,
      enum: TICKET_STATUSES.ALL,
      default: TICKET_STATUSES.ACTIVE,
      label: 'Status',
      index: true,
    },
    customFieldsData: {
      type: [customFieldSchema],
      optional: true,
      label: 'Custom fields data',
    },
    score: {
      type: Number,
      optional: true,
      label: 'Score',
      esType: 'number',
    },
    number: {
      type: String,
      unique: true,
      sparse: true,
      label: 'Item number',
    },
    relations: {
      type: [relationSchema],
      optional: true,
      label: 'Related items used for gantt chart',
    },
    tagIds: {
      type: [String],
      optional: true,
      index: true,
      label: 'Tags',
    },
    branchIds: {
      type: [String],
      optional: true,
      index: true,
      label: 'Branches',
    },
    departmentIds: {
      type: [String],
      optional: true,
      index: true,
      label: 'Departments',
    },

    source: { type: String, label: 'Source' },
  },
  {
    timestamps: true,
  },
);
