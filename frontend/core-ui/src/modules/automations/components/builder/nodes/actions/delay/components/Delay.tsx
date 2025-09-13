import { lazy } from 'react';

const DelayComponents = {
  delay: {
    sidebar: lazy(() =>
      import('./DelayConfigForm').then((module) => ({
        default: module.DelayConfigForm,
      })),
    ),
    nodeContent: lazy(() =>
      import('./DelayNodeContent').then((module) => ({
        default: module.DelayNodeContent,
      })),
    ),
  },
};

export default DelayComponents;
