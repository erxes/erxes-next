import { IAction, ITrigger } from 'ui-modules/modules/automations';

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
  type?: string;
  category?: string;
  config?: Record<string, any>;
  configurable?: boolean;
  outputs?: number;
  color?: string;
  error?: string;
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
