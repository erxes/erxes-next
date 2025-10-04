import { EXECUTE_WAIT_TYPES } from 'erxes-api-shared/core-modules';
import { Schema } from 'mongoose';

const waitConditionTypes = [
  EXECUTE_WAIT_TYPES.IS_IN_SEGMENT,
  EXECUTE_WAIT_TYPES.CHECK_OBJECT,
  EXECUTE_WAIT_TYPES.WEBHOOK,
] as const;
export type WaitConditionType = (typeof waitConditionTypes)[number];

export interface IAutomationWaitingAction {
  automationId: string;
  executionId: string;
  currentActionId: string;
  responseActionId: string;
  conditionType: WaitConditionType;
  conditionConfig: any;
  lastCheckedAt: Date;
}

export interface IAutomationWaitingActionDocument
  extends IAutomationWaitingAction,
    Document {
  _id: string;
}

export const waitingActionsToExecuteSchema = new Schema(
  {
    automationId: { type: String, required: true, index: true },
    executionId: { type: String, required: true, index: true },
    currentActionId: {
      type: String,
      required: true,
    },
    responseActionId: {
      type: String,
    },
    conditionType: {
      type: String,
      enum: waitConditionTypes,
      required: true,
      index: true,
    },
    conditionConfig: {
      type: Schema.Types.Mixed,
      required: true,
    },
    lastCheckedAt: Date,
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  },
);
