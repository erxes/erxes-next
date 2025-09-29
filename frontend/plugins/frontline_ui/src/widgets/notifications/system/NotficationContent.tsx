import { lazy } from 'react';

const WelcomeNotificationContent = lazy(() =>
  import('./WelcomeMessage').then((module) => ({
    default: module.WelcomeMessageNotificationContent,
  })),
);

export const NotificationContent = {
  welcome: WelcomeNotificationContent,
};
