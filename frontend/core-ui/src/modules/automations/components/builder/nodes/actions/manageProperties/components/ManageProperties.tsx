import { lazy } from 'react';

const ManagePropertiesComponents = {
  setProperty: {
    sidebar: lazy(() =>
      import('./ManagePropertiesConfigForm').then((module) => ({
        default: module.ManagePropertiesConfigForm,
      })),
    ),
    nodeContent: lazy(() =>
      import('./ManagePropertiesNodeContent').then((module) => ({
        default: module.ManagePropertiesNodeContent,
      })),
    ),
  },
};

export default ManagePropertiesComponents;
