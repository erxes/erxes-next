import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { Node } from '@xyflow/react';
import { UseFormSetValue } from 'react-hook-form';
import { IAction, ITrigger } from 'ui-modules';

export interface AutomationConstants {
  triggersConst: ITrigger[];
  triggerTypesConst: string[];
  actionsConst: any[];
  propertyTypesConst: Array<{ value: string; label: string }>;
}
export interface ConstantsQueryResponse {
  automationConstants: AutomationConstants;
}

export type NodeData = {
  id: string;
  nodeIndex: number;
  label: string;
  nodeType: 'trigger' | 'action';
  icon?: React.ReactNode;
  description?: string;
  type: string;
  category?: string;
  config?: Record<string, any>;
  configurable?: boolean;
  outputs?: number;
  color?: string;
  error?: string;
  isCustom?: boolean;
  nextActionId?: string;
  actionId?: string;
  beforeTitleContent?: (
    id: string,
    type: 'action' | 'trigger',
  ) => React.ReactNode;
};

export interface IAutomationDoc {
  name: string;
  status: string;
  triggers: ITrigger[];
  actions: IAction[];
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
  updatedUser?: any;
  createdUser?: any;
  tags?: any[];
  tagIds?: string[];
}

export interface IAutomationNoteDoc {
  triggerId: string;
  actionId: string;
  description: string;
  createdUser?: any;
  createdAt?: Date;
}

export interface IAutomation extends IAutomationDoc {
  _id: string;
}

export interface IAutomationHistoryAction {
  createdAt?: Date;
  actionId: string;
  actionType: string;
  actionConfig?: any;
  nextActionId?: string;
  result?: any;
}

export interface IAutomationHistory {
  _id: string;
  createdAt: Date;
  modifiedAt?: Date;
  automationId: string;
  triggerId: string;
  triggerType: string;
  triggerConfig?: any;
  nextActionId?: string;
  targetId: string;
  target: any;
  status: string;
  description: string;
  actions?: IAutomationHistoryAction[];
  startWaitingDate?: Date;
  waitingActionId?: string;
}

export type AutomationDropHandlerParams = {
  event: React.DragEvent<HTMLDivElement>;
  reactFlowInstance: any;
  triggers: any[];
  actions: any[];
};

export type TDraggingNode = {
  nodeType: 'trigger' | 'action';
  type: string;
  label: string;
  description: string;
  icon: string;
  isCustom?: boolean;
  awaitingToConnectNodeId?: string;
};
