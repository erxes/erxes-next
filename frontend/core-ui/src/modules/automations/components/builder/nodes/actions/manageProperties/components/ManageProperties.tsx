import { lazy } from 'react';
import {
  AutomationCoreNodeComponent,
  AutomationNodeType,
} from '@/automations/types';

const ManagePropertiesComponents: AutomationCoreNodeComponent<AutomationNodeType.Action> =
  {
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
