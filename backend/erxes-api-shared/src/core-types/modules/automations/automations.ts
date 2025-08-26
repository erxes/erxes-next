import { IAction, IAutomationExecution, ITrigger } from '@/core-modules';

export type ICheckTriggerData = {
  collectionType: string;
  automationId: string;
  trigger: ITrigger;
  target: any;
  config: any;
};

export type IReplacePlaceholdersData<TTarget = any> = {
  target: TTarget;
  config: any;
  relatedValueProps: any;
};

export type IAutomationWorkerContext<TModels = any> = {
  models: TModels;
  subdomain: string;
};

export type IAutomationReceiveActionData = {
  action: IAction;
  execution: { _id: string } & IAutomationExecution;
  actionType: string;
  collectionType: string;
  triggerType: string;
};
