import {
  AutomationCoreNodeComponent,
  AutomationNodeType,
} from '@/automations/types';
import { lazy } from 'react';

const WebhooksComponents: AutomationCoreNodeComponent<AutomationNodeType.Trigger> =
  {
    incoming_webhook: {
      sidebar: lazy(() =>
        import('./components/IncomingWebhookConfigForm').then((module) => ({
          default: module.IncomingWebhookConfigForm,
        })),
      ),
      nodeContent: lazy(() =>
        import('./components/IncomingWebhookNodeContent').then((module) => ({
          default: module.IncomingWebhookNodeContent,
        })),
      ),
    },
  };

export default WebhooksComponents;
