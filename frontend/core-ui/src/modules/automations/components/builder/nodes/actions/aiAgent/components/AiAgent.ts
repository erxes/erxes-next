import { lazy } from 'react';

const AiAgentComponents = {
  sidebar: lazy(() =>
    import('./AiAgentConfigForm').then((module) => ({
      default: module.AIAgentConfigForm,
    })),
  ),
};

export default AiAgentComponents;
