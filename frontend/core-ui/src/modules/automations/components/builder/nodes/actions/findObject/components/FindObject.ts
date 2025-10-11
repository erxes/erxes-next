import { lazy } from 'react';
import {
  AutomationComponentMap,
  AutomationNodeType,
} from '@/automations/types';

const FindObjectComponents: AutomationComponentMap<AutomationNodeType.Action> =
  {
    findObject: {
      sidebar: lazy(() =>
        import('./FindObjectConfigForm').then((module) => ({
          default: module.FindObjectConfigForm,
        })),
      ),
      nodeContent: lazy(() =>
        import('./FindObjectNodeContent').then((module) => ({
          default: module.FindObjectNodeContent,
        })),
      ),
    },
  };

export default FindObjectComponents;
