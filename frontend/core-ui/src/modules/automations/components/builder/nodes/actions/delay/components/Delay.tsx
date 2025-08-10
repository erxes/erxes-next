import { lazy } from 'react';

const DelayComponents = {
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
};

export default DelayComponents;
