import { lazy } from 'react';
import {
  AutomationCoreNodeComponent,
  AutomationNodeType,
} from '@/automations/types';

const DelayComponents: AutomationCoreNodeComponent<AutomationNodeType.Action> =
  {
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
