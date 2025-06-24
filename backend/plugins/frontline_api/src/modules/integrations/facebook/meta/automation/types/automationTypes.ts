import {
  IAction,
  IAutomationExecutionDocument,
  ITrigger,
} from 'erxes-api-shared/core-modules';
import { IModels } from '~/connectionResolvers';
import { IFacebookConversationMessage } from '@/integrations/facebook/@types/conversationMessages';
import { IFacebookIntegrationDocument } from '@/integrations/facebook/@types/integrations';

export type IAutomationWorkerContext = {
  models: IModels;
  subdomain: string;
};

export type IAutomationReceiveActionData = {
  action: IAction;
  execution: IAutomationExecutionDocument;
  actionType: string;
  collectionType: string;
  triggerType: string;
};

export type ISendMessageData = {
  senderId: string;
  recipientId: string;
  integration: IFacebookIntegrationDocument;
  message: any;
  tag?: string;
};

export type ICheckTriggerData = {
  collectionType: string;
  automationId: string;
  trigger: ITrigger;
  target: any;
  config: any;
};

export type IReplacePlaceholdersData = {
  target: IFacebookConversationMessage;
  config: any;
  relatedValueProps: any;
};
