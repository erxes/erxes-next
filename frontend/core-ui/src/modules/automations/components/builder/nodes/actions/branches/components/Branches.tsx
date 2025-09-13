import { lazy } from 'react';

const BranchComponents = {
  if: {
    sidebar: lazy(() =>
      import('./BranchesConfigForm').then((module) => ({
        default: module.BranchesConfigForm,
      })),
    ),
  },
};

export default BranchComponents;
