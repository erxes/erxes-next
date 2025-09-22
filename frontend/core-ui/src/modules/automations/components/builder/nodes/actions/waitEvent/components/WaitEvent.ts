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
  },
};

export default WaitEventComponents;
