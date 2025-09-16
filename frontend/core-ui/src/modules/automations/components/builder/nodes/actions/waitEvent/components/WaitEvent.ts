import { lazy } from 'react';
import {
  AutomationCoreNodeComponent,
  AutomationNodeType,
} from '@/automations/types';

const WaitEventComponents: AutomationCoreNodeComponent<AutomationNodeType.Action> =
  {
    waitEvent: {
      sidebar: lazy(() =>
        import('./WaitEventConfigForm').then((module) => ({
          default: module.WaitEventConfigForm,
        })),
      ),
    },
  };

export default WaitEventComponents;
