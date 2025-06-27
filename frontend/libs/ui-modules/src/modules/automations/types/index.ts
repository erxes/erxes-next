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

export type IAction = {
  id: string;
  type: string;
  icon?: string;
  label?: string;
  description?: string;
  nextActionId?: string;
  isAvailable?: boolean;
  style?: any;
  config?: IConfig;
  position?: any;
  isAvailableOptionalConnect?: boolean;
  workflowId?: string;

  count?: number;
};

export type ITrigger = {
  id: string;
  type: string;
  icon?: string;
  label?: string;
  description?: string;
  actionId?: string;
  style?: any;
  config?: any;
  position?: any;
  isAvailableOptionalConnect?: boolean;
  isCustom?: boolean;
  workflowId?: string;

  count?: number;
};
