import {
  callConfigAtom,
  sipStateAtom,
} from '@/integrations/call/states/sipStates';
import { useAtom } from 'jotai';
import SipProvider from './SipProvider';
import { useMutateCallHistory } from '@/integrations/call/hooks/useMutateCallHistory';
import { useCallCreateSession } from '@/integrations/call/hooks/useCallCreateSession';
import { useCallUserIntegration } from '@/integrations/call/hooks/useCallUserIntegration';
import { useCallGetConfigs } from '@/integrations/call/hooks/useCallGetConfigs';
import { CallSelectConfig } from '@/integrations/call/components/CallSelectConfig';

export const SipContainer = ({ children }: { children: React.ReactNode }) => {
  const [callConfig] = useAtom(callConfigAtom);
  const [sipState] = useAtom(sipStateAtom);

  const { callUserIntegrations, loading: callUserIntegrationLoading } =
    useCallUserIntegration();
  const { callConfigs, loading: callConfigLoading } = useCallGetConfigs();

  const { updateHistory, addHistory } = useMutateCallHistory();

  const { createActiveSession } = useCallCreateSession();

  if (
    callUserIntegrationLoading ||
    callConfigLoading ||
    !callUserIntegrations?.length ||
    !Object.values(callConfigs)?.length
  ) {
    return null;
  }

  if (!callConfig || !callConfig.inboxId) {
    return <CallSelectConfig callUserIntegrations={callUserIntegrations} />;
  }

  const { wsServer, operators } = callConfig;

  const [host = 'call.erxes.io', port = '8089'] =
    (wsServer || '').split(':') || [];

  const operator = operators?.[0];

  const sipConfig = {
    host,
    pathname: '/ws',
    user: operator?.gsUsername,
    password: operator?.gsPassword,
    port: parseInt(port?.toString() || '8089', 10),
    iceServers: [
      {
        urls: `turn:${callConfigs.TURN_SERVER_URL}`,
        username: callConfigs.TURN_SERVER_USERNAME,
        credential: callConfigs.TURN_SERVER_CREDENTIAL,
      },
      {
        urls: `stun:${callConfigs.STUN_SERVER_URL}`,
      },
    ],
  };

  return (
    <SipProvider
      createSession={createActiveSession}
      // updateHistory={updateHistory}
      addHistory={addHistory}
      {...sipConfig}
    >
      {children}
    </SipProvider>
  );
};
