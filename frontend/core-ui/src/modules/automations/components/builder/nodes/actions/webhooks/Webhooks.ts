import {
  AutomationComponentMap,
  AutomationNodeType,
} from '@/automations/types';
import { lazy } from 'react';

const WebhooksComponents: AutomationComponentMap<AutomationNodeType.Action> = {
  outgoingWebhook: {
    sidebar: lazy(() =>
      import('./components/OutgoingWebhookConfigForm').then((module) => ({
        default: module.OutgoingWebhookConfigForm,
      })),
    ),
    nodeContent: lazy(() =>
      import('./components/OutgoingWebhookNodeContent').then((module) => ({
        default: module.OutgoingWebhookNodeContent,
      })),
    ),
  },
  incoming_webhook: {
    waitEvent: lazy(() =>
      import('./components/OutgoingWebhookWaitEventForm').then((module) => ({
        default: module.OutgoingWebhookWaitEventForm,
      })),
    ),
  },
};

export default WebhooksComponents;
