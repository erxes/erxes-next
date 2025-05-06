type IContext = {
  subdomain: string;
  processId?: string;
};

type ITriggerConfig = {
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

type IActionConfig = {
  type: string;
  icon: string;
  label: string;
  description: string;
  isAvailableOptionalConnect?: boolean;
};

export type AutomationConstants =
  | { triggers: ITriggerConfig[]; actions?: IActionConfig }
  | { triggers?: ITriggerConfig[]; actions: IActionConfig }
  | { triggers: ITriggerConfig[]; actions: IActionConfig };

export interface AutomationConfigs {
  constants: AutomationConstants;
  receiveActions?: (context: IContext, args: any) => Promise<any>;
  getRecipientsEmails?: (context: IContext, args: any) => Promise<any>;
  replacePlaceHolders?: (context: IContext, args: any) => Promise<any>;
  checkCustomTrigger?: (context: IContext, args: any) => Promise<any>;
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
