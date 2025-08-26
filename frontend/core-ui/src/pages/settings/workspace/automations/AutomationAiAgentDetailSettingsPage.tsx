import { AutomationAiAgentDetail } from '@/automations/components/settings/components/agents/components/AutomationAiAgentDetail';
import { useParams } from 'react-router';

export const AutomationBotDetailSettingsPage = () => {
  const { kind } = useParams();

  if (!kind) {
    return null;
  }

  return <AutomationAiAgentDetail kind={kind} />;
};
