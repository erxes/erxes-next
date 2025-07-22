import { callConfigAtom } from '@/integrations/call/states/sipStates';
import { useAtom } from 'jotai';
import SipProvider from './SipProvider';
import { useMutateCallHistory } from '@/integrations/call/hooks/useMutateCallHistory';
import { useCallCreateSession } from '@/integrations/call/hooks/useCallCreateSession';
import { useCallUserIntegration } from '@/integrations/call/hooks/useCallUserIntegration';
import { useCallGetConfigs } from '@/integrations/call/hooks/useCallGetConfigs';

export const SipContainer = ({ children }: { children: React.ReactNode }) => {
  const [callConfig] = useAtom(callConfigAtom);
  const { callUserIntegrations, loading: callUserIntegrationLoading } =
    useCallUserIntegration();
  const { callConfigs, loading: callConfigLoading } = useCallGetConfigs();

  const { updateHistory, addHistory } = useMutateCallHistory();

  const { createActiveSession } = useCallCreateSession();

  if (
    callUserIntegrationLoading ||
    callConfigLoading ||
    !callUserIntegrations?.length ||
    !callConfigs?.length
  ) {
    return null;
  }

  if (!callConfig || !callConfig.inboxId) {
    return null;
  }

  return (
    <SipProvider
      callUserIntegration={callConfig?.callUserIntegration}
      createSession={createActiveSession}
      updateHistory={updateHistory}
      addHistory={addHistory}
    >
      {children}
    </SipProvider>
  );
};
