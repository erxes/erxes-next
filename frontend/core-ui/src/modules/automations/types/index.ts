import { STATUSES_BADGE_VARIABLES } from '@/automations/constants';
import { Edge, EdgeProps, Node, ReactFlowInstance } from '@xyflow/react';
import {
  IAction,
  IWorkflowNode,
  IAutomationsActionConfigConstants,
  IAutomationsTriggerConfigConstants,
  ITrigger,
} from 'ui-modules';

export interface AutomationConstants {
  triggersConst: IAutomationsTriggerConfigConstants[];
  triggerTypesConst: string[];
  actionsConst: IAutomationsActionConfigConstants[];
  propertyTypesConst: Array<{ value: string; label: string }>;
}
export interface ConstantsQueryResponse {
  automationConstants: AutomationConstants;
}

export type NodeData = {
  id: string;
  nodeIndex: number;
  label: string;
  nodeType: AutomationNodeType;
  icon?: string;
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
    type: AutomationNodeType,
  ) => React.ReactNode;
};

export type WorkflowNodeData = {
  automationId: string;
  config: any;
  description: string;
  label: string;
  nodeType: string;
};

export interface IAutomationDoc {
  name: string;
  status: string;
  triggers: ITrigger[];
  actions: IAction[];
  updatedAt?: string;
  createdAt?: string;
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

export type AutomationDropHandlerParams = {
  event: React.DragEvent<HTMLDivElement>;
  reactFlowInstance: ReactFlowInstance<Node<NodeData>, Edge<EdgeProps>> | null;
  triggers: ITrigger[];
  actions: IAction[];
  workflows?: IWorkflowNode[];
};

export type TDraggingNode = {
  nodeType: AutomationNodeType;
  type: string;
  label: string;
  description: string;
  icon: string;
  isCustom?: boolean;
  awaitingToConnectNodeId?: string;
};
export type StatusBadgeValue =
  (typeof STATUSES_BADGE_VARIABLES)[keyof typeof STATUSES_BADGE_VARIABLES];

export enum AutomationsHotKeyScope {
  Builder = 'automation-builder',
  BuilderSideBar = 'automation-builder-sidebar',
  BuilderPanel = 'automation-builder-panel',
  HistoriesFilter = 'automation-histories-filter',
}

export enum AutomationsPath {
  Index = '/automations',
  Detail = '/edit/:id',
}

export enum AutomationNodeType {
  Trigger = 'trigger',
  Action = 'action',
  Workflow = 'workflow',
}

export enum AutomationNodesType {
  Triggers = 'triggers',
  Actions = 'actions',
  Workflows = 'workflows',
}

export enum AutomationBuilderTabsType {
  Builder = 'builder',
  History = 'history',
}
