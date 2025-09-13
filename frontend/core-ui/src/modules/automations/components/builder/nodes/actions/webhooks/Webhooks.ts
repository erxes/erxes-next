import { lazy } from 'react';

const WebhooksComponents = {
  outgoingWebhook: {
    sidebar: lazy(() =>
      import('./OutgoingWebhookConfigForm').then((module) => ({
        default: module.OutgoingWebhookConfigForm,
      })),
    ),
  },
};

export default WebhooksComponents;
