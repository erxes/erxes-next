import { lazy } from 'react';

const WelcomeNotificationContent = lazy(() =>
  import('./system/WelcomeMessage').then((module) => ({
    default: module.WelcomeMessageNotificationContent,
  })),
);

export const NotificationContent = {
  welcome: WelcomeNotificationContent,
};
