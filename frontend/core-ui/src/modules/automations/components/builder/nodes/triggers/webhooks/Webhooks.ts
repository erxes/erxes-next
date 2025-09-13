import { lazy } from 'react';

const WebhooksComponents = {
  incoming_webhook: {
    sidebar: lazy(() =>
      import('./components/IncomingWebhookConfigForm').then((module) => ({
        default: module.IncomingWebhookConfigForm,
      })),
    ),
  },
};

export default WebhooksComponents;
