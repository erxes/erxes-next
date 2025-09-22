import { lazy } from 'react';
import {
  AutomationComponentMap,
  AutomationNodeType,
} from '@/automations/types';

const DelayComponents: AutomationComponentMap<AutomationNodeType.Action> = {
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
