import { AutomationAiAgentDetail } from '@/automations/components/settings/components/agents/components/AutomationAiAgentDetail';
import { useAiAgentDetail } from '@/automations/components/settings/components/agents/hooks/useAiAgentDetail';
import { useParams } from 'react-router';

export const AutomationBotDetailSettingsPage = () => {
  const { id } = useParams();
  const { detail, handleSave } = useAiAgentDetail(id);

  return <AutomationAiAgentDetail detail={detail} handleSave={handleSave} />;
};
