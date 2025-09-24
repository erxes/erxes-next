import {
  AutomationComponentMap,
  AutomationNodeType,
} from '@/automations/types';
import { lazy } from 'react';

const AiAgentComponents: AutomationComponentMap<AutomationNodeType.Action> = {
  aiAgent: {
    sidebar: lazy(() =>
      import('./AiAgentConfigForm').then((module) => ({
        default: module.AIAgentConfigForm,
      })),
    ),
    nodeContent: lazy(() =>
      import('./AiAgentNodeContent').then((module) => ({
        default: module.AiAgentNodeContent,
      })),
    ),
  },
};

export default AiAgentComponents;
