import React from 'react';

export type IActionProps = {
  currentActionIndex: number;
  currentAction: IAction;
  handleSave: (config: any) => void;
};

type WorkflowConnection = {
  sourceId: string;
  targetId: string;
};

export type OptionalConnect = {
  sourceId: string;
  actionId: string;
  optionalConnectId: string;
};

type IConfig = {
  workflowConnection?: WorkflowConnection;
  optionalConnect?: OptionalConnect[];
  [key: string]: any;
};

export type IAction<TConfig = any> = {
  id: string;
  type: string;
  icon?: string;
  label: string;
  description: string;
  nextActionId?: string;
  isAvailable?: boolean;
  style?: any;
  config?: TConfig & IConfig;
  position?: any;
  isAvailableOptionalConnect?: boolean;
  workflowId?: string;

  count?: number;
};

export type ITrigger<TConfig = any> = {
  id: string;
  type: string;
  icon?: string;
  label: string;
  description: string;
  actionId?: string;
  style?: any;
  config?: TConfig;
  position?: any;
  isAvailableOptionalConnect?: boolean;
  isCustom?: boolean;
  workflowId?: string;

  count?: number;
};

export type BaseAutomationRemoteProps = {
  type?: string;
  componentType: string;
};

export type AutomationTriggerFormProps<TConfig = any> =
  BaseAutomationRemoteProps & {
    componentType: 'triggerForm';
    activeTrigger: ITrigger<TConfig>;
    onSaveTriggerConfig: (config: TConfig) => void;
  };

export type AutomationActionFormProps<TConfig = any> =
  BaseAutomationRemoteProps & {
    componentType: 'actionForm';
    currentAction: IAction<TConfig>;
    onSaveActionConfig: (config: TConfig) => void;
  };

export type AutomationTriggerConfigProps<TConfig = any> =
  BaseAutomationRemoteProps & {
    componentType: 'triggerConfigContent';
    config: TConfig;
  };

export type AutomationActionNodeConfigProps<
  TActionConfig = any,
  TTriggerConfig = any,
> = BaseAutomationRemoteProps & {
  componentType: 'actionNodeConfiguration';
  currentAction?: any;
  config?: TActionConfig;
  trigger?: ITrigger<TTriggerConfig>;
  OptionConnectHandle?: ({
    optionalId,
  }: {
    optionalId: string;
  }) => React.ReactNode;
};

export type AutomationRemoteEntryProps =
  | AutomationTriggerFormProps
  | AutomationActionFormProps
  | AutomationTriggerConfigProps
  | AutomationActionNodeConfigProps
  | { componentType: 'automationBotsContent' };

export type AutomationRemoteEntryTypes = {
  TriggerForm: AutomationTriggerFormProps;
  ActionForm: AutomationActionFormProps;
  TriggerNodeConfig: AutomationTriggerConfigProps;
  ActionNodeConfig: AutomationActionNodeConfigProps;
};
