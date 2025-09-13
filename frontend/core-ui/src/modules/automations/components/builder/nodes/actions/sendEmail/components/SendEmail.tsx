import { lazy } from 'react';

const SendEmailComponents = {
  sendEmail: {
    sidebar: lazy(() =>
      import('./SendEmailConfigForm').then((module) => ({
        default: module.SendEmailConfigForm,
      })),
    ),
    nodeContent: lazy(() =>
      import('./SendEmailNodeContent').then((module) => ({
        default: module.SendEmailNodeContent,
      })),
    ),
    actionResult: lazy(() =>
      import('./SendEmailActionResult').then((module) => ({
        default: module.AutomationSendEmailActionResult,
      })),
    ),
  },
};

export default SendEmailComponents;
