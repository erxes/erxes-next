import {
  AutomationCoreNodeComponent,
  AutomationNodeType,
} from '@/automations/types';
import { lazy } from 'react';

const WebhooksComponents: AutomationCoreNodeComponent<AutomationNodeType.Action> =
  {
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
  };

export default WebhooksComponents;
