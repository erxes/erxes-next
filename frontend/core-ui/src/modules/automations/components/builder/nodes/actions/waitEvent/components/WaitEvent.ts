import { lazy } from 'react';
import {
  AutomationComponentMap,
  AutomationNodeType,
} from '@/automations/types';

const WaitEventComponents: AutomationComponentMap<AutomationNodeType.Action> = {
  waitEvent: {
    sidebar: lazy(() =>
      import('./WaitEventConfigForm').then((module) => ({
        default: module.WaitEventConfigForm,
      })),
    ),
    nodeContent: lazy(() =>
      import('./WaitEventNodeContent').then((module) => ({
        default: module.WaitEventNodeContent,
      })),
    ),
  },
};

export default WaitEventComponents;
