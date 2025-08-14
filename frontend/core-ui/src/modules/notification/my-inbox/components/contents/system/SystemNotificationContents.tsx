import { lazy } from 'react';

export const SystemNotificationContents = {
  welcomeMessage: lazy(() =>
    import('./WelcomeMessage').then((module) => ({
      default: module.WelcomeMessageNotificationContent,
    })),
  ),
};
