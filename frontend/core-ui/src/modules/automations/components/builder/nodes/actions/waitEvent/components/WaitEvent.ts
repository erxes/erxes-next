import { lazy } from 'react';

const WaitEventComponents = {
  waitEvent: {
    sidebar: lazy(() =>
      import('./WaitEventConfigForm').then((module) => ({
        default: module.WaitEventConfigForm,
      })),
    ),
  },
};

export default WaitEventComponents;
