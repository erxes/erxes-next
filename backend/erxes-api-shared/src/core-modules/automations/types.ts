import { IAction, ITrigger } from './definitions/automations';
import { IAutomationExecution } from './definitions/executions';

type IContext = {
  subdomain: string;
  processId?: string;
};

export type IAutomationsTriggerConfig = {
  type: string;
  icon: string;
  label: string;
  description: string;
  isCustom?: boolean;
  conditions?: {
    type: string;
    icon: string;
    label: string;
    description: string;
  }[];
};

export type IAutomationsActionConfig = {
  type: string;
  icon: string;
  label: string;
  description: string;
  isAvailableOptionalConnect?: boolean;
  emailRecipientsConst?: any;
};

export type IAutomationsBotsConfig = {
  moduleName: string;
  name: string;
  label: string;
  description: string;
  logo: string;
  totalCountQueryName: string;
};

type IAutomationTriggersActionsConfig =
  | {
      triggers: IAutomationsTriggerConfig[];
      actions?: IAutomationsActionConfig[];
    }
  | {
      triggers?: IAutomationsTriggerConfig[];
      actions: IAutomationsActionConfig[];
    };

export type AutomationConstants = IAutomationTriggersActionsConfig & {
  bots?: IAutomationsBotsConfig[];
};

// export type AutomationConstants =
//   | {
//       triggers: IAutomationsTriggerConfig[];
//       actions?: IAutomationsActionConfig[];
//       bots?:IAutomationsBotsConfig[]
//     }
//   | {
//       triggers?: IAutomationsTriggerConfig[];
//       actions: IAutomationsActionConfig[];
//       bots?:IAutomationsBotsConfig[]
//     }
//   | {
//       triggers: IAutomationsTriggerConfig[];
//       actions: IAutomationsActionConfig[];
//       bots?:IAutomationsBotsConfig[]
//     };

export interface AutomationConfigs {
  constants: AutomationConstants;
  receiveActions?: (
    context: IContext,
    args: {
      moduleName: string;
      collectionType: string;
      actionType: string;
      triggerType: string;
      action: IAction;
      execution: IAutomationExecution;
    },
  ) => Promise<any>;

  getRecipientsEmails?: (context: IContext, args: any) => Promise<any>;
  replacePlaceHolders?: (context: IContext, args: any) => Promise<any>;
  checkCustomTrigger?: <TTarget = any, TConfig = any>(
    context: IContext,
    args: {
      moduleName: string;
      collectionType: string;
      automationId: string;
      trigger: ITrigger;
      target: TTarget;
      config: TConfig;
    },
  ) => Promise<any>;
}

export interface IReplacePlaceholdersProps<TModels> {
  models: TModels;
  subdomain: string;
  actionData: Record<string, any>;
  target: Record<string, any>;
  customResolver?: {
    isRelated?: boolean;
    resolver?: (
      models: TModels,
      subdomain: string,
      referenceObject: any,
      placeholderKey: string,
      props: any,
    ) => Promise<any>;
    props?: any;
  };
  complexFields?: string[];
}

export interface IPerValueProps<TModels> {
  models: TModels;
  subdomain: string;
  relatedItem: any;
  rule: any;
  target: any;
  getRelatedValue: any;
  triggerType?: string;
  serviceName?: string;
  execution: any;
}

type IPRopertyRule = {
  field: string;
  operator: string;
  value: any;
  forwardTo: any;
};

export interface IPropertyProps<TModels> {
  models: TModels;
  subdomain: string;
  module: string;
  rules: IPRopertyRule[];
  execution: any;
  getRelatedValue: any;
  relatedItems: any[];
  triggerType?: string;
}
