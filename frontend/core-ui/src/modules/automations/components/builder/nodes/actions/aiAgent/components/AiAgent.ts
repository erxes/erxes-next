import { lazy } from 'react';

const AiAgentComponents = {
  aiAgent: {
    sidebar: lazy(() =>
      import('./AiAgentConfigForm').then((module) => ({
        default: module.AIAgentConfigForm,
      })),
    ),
  },
};

export default AiAgentComponents;
