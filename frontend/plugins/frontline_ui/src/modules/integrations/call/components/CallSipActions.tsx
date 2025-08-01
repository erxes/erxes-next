import { usePauseAgent } from '@/integrations/call/hooks/usePauseAgent';
import {
  callConfigAtom,
  callInfoAtom,
  sipStateAtom,
} from '@/integrations/call/states/sipStates';
import { ICallConfigDoc } from '@/integrations/call/types/callTypes';
import { SipStatusEnum } from '@/integrations/call/types/sipTypes';
import { IconPlayerPlay, IconPower } from '@tabler/icons-react';
import { Badge, Button } from 'erxes-ui';
import { useAtomValue, useSetAtom } from 'jotai';

export const CallSipActions = () => {
  return (
    <div className="flex items-center gap-2">
      <SipStatusBadge />
      <SipPauseButton />
      <TurnOffButton />
    </div>
  );
};

export const TurnOffButton = () => {
  const sipState = useAtomValue(sipStateAtom);
  const setConfig = useSetAtom(callConfigAtom);
  const setCallInfo = useSetAtom(callInfoAtom);

  const isConnected =
    sipState?.sipStatus === SipStatusEnum.CONNECTED ||
    sipState?.sipStatus === SipStatusEnum.REGISTERED;

  const handleConnection = () => {
    setConfig((prev) => ({
      ...(prev || ({} as ICallConfigDoc)),
      isAvailable: isConnected ? false : true,
    }));
    setCallInfo((prev) => ({
      ...prev,
      isUnregistered: isConnected ? true : false,
    }));
  };

  return (
    <Button size="sm" variant="secondary" onClick={handleConnection}>
      <IconPower /> turn {isConnected ? 'off' : 'on'}
    </Button>
  );
};

export const SipPauseButton = () => {
  const { pauseAgent, loading } = usePauseAgent();
  return (
    <Button
      size="sm"
      variant="outline"
      className="ml-auto"
      onClick={() => pauseAgent('pause')}
      disabled={loading}
    >
      <IconPlayerPlay /> unpause
    </Button>
  );
};

export const SipStatusBadge = () => {
  const sipState = useAtomValue(sipStateAtom);
  const setCallInfo = useSetAtom(callInfoAtom);
  const setCallConfig = useSetAtom(callConfigAtom);

  const isConnected =
    sipState?.sipStatus === SipStatusEnum.CONNECTED ||
    sipState?.sipStatus === SipStatusEnum.REGISTERED;

  const handleConnection = () => {
    setCallInfo((prev) => ({ ...prev, isUnregistered: !isConnected }));
    setCallConfig((prev) => ({
      ...(prev || ({} as ICallConfigDoc)),
      isAvailable: isConnected,
    }));
  };

  return (
    <Badge
      variant={isConnected ? 'success' : 'destructive'}
      onClick={handleConnection}
    >
      {isConnected ? 'Online' : 'Offline'}
    </Badge>
  );
};
