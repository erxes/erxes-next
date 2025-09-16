import { lazy } from 'react';
import {
  AutomationCoreNodeComponent,
  AutomationNodeType,
} from '@/automations/types';

const BranchComponents: AutomationCoreNodeComponent<AutomationNodeType.Action> =
  {
    if: {
      sidebar: lazy(() =>
        import('./BranchesConfigForm').then((module) => ({
          default: module.BranchesConfigForm,
        })),
      ),
    },
  };

export default BranchComponents;
