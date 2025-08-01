import { Document, Schema } from 'mongoose';
import { AUTOMATION_STATUSES } from '../constants';

export type IActionsMap = { [key: string]: IAction };

export interface IAction {
  id: string;
  type: string;
  nextActionId?: string;
  config?: any;
  style?: any;
  icon?: string;
  label?: string;
  description?: string;
  workflowId?: string;
}

export type TriggerType =
  | 'customer'
  | 'company'
  | 'deal'
  | 'task'
  | 'purchase'
  | 'ticket'
  | 'conversation';

export interface ITrigger {
  id: string;
  type: string;
  actionId?: string;
  config: {
    contentId: string;
    reEnrollment: boolean;
    reEnrollmentRules: string[];
    dateConfig: any;
  };
  style?: any;
  icon?: string;
  label?: string;
  description?: string;
  isCustom?: boolean;
  workflowId?: string;
}

export interface IAutomation {
  name: string;
  status: string;
  triggers: ITrigger[];
  actions: IAction[];
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  tagIds: string[];
}

export interface IAutomationDoc extends IAutomation {
  _id?: string;
}

export interface IAutomationDocument extends IAutomation, Document {
  _id: string;
}

const triggerSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    actionId: { type: String },
    config: { type: Object },
    style: { type: Object },
    position: { type: Object },
    icon: { type: String, optional: true },
    label: { type: String, optional: true },
    description: { type: String, optional: true },
    isCustom: { type: Boolean, optional: true },
    workflowId: { type: String, optional: true },
  },
  { _id: false },
);

const actionSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    nextActionId: { type: String },
    config: { type: Object },
    style: { type: Object },
    position: { type: Object },
    icon: { type: String, optional: true },
    label: { type: String, optional: true },
    description: { type: String, optional: true },
    workflowId: { type: String, optional: true },
  },
  { _id: false },
);

export const automationSchema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
  status: { type: String, default: AUTOMATION_STATUSES.DRAFT },
  triggers: { type: [triggerSchema] },
  actions: { type: [actionSchema] },
  createdAt: {
    type: Date,
    default: new Date(),
    label: 'Created date',
  },
  createdBy: { type: String },
  updatedAt: { type: Date, default: new Date(), label: 'Updated date' },
  updatedBy: { type: String },
  tagIds: { type: [String], label: 'Tag Ids', optional: true },
});
