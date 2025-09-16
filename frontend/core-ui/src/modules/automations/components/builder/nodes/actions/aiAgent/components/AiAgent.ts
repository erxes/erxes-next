import {
  AutomationCoreNodeComponent,
  AutomationNodeType,
} from '@/automations/types';
import { lazy } from 'react';

const AiAgentComponents: AutomationCoreNodeComponent<AutomationNodeType.Action> =
  {
    aiAgent: {
      sidebar: lazy(() =>
        import('./AiAgentConfigForm').then((module) => ({
          default: module.AIAgentConfigForm,
        })),
      ),
    },
  };

export default AiAgentComponents;
