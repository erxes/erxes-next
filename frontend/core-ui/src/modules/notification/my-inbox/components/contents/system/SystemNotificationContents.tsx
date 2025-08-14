import { lazy } from 'react';

export const SystemNotificationContents = {
  welcomeMessage: lazy(() =>
    import('./WelcomMessage').then((module) => ({
      default: module.WelcomeMessageNotificationContent,
    })),
  ),
};
