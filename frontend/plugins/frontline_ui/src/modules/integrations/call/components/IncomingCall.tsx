import { useSip } from '@/integrations/call/components/SipProvider';
import { sipStateAtom } from '@/integrations/call/states/sipStates';
import { IconPhone, IconPhoneEnd } from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { useAtomValue } from 'jotai';
import {
  CallDirectionEnum,
  CallStatusEnum,
} from '@/integrations/call/types/sipTypes';
import { CallNumber } from '@/integrations/call/components/CallNumber';
import { useEffect, useRef } from 'react';
import { getPluginAssetsUrl } from 'erxes-ui';

export const IncomingCallAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const sip = useAtomValue(sipStateAtom);

  useEffect(() => {
    if (
      sip?.callStatus === CallStatusEnum.STARTING &&
      sip.callDirection === CallDirectionEnum.INCOMING
    ) {
      if (audioRef.current) {
        audioRef.current.src = getPluginAssetsUrl(
          'frontline',
          '/sound/incomingRingtone.mp3',
        );
        audioRef.current.loop = true;
        audioRef.current.play().catch(() => {
          if (audioRef.current) {
            audioRef.current.src = '';
          }
        });
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    }
  }, [sip?.callStatus, sip?.callDirection]);

  return <audio ref={audioRef} loop autoPlay />;
};

export const IncomingCall = () => {
  const sipState = useAtomValue(sipStateAtom);

  const { answerCall, stopCall } = useSip();

  const onAcceptCall = () => {
    if (answerCall && sipState?.callStatus !== CallStatusEnum.IDLE) {
      answerCall();
    }
  };

  const onDeclineCall = () => {
    if (stopCall) {
      stopCall();
    }
  };

  return (
    <>
      <div className="mt-2 px-3 pt-3 mb-1 space-y-2">
        <CallNumber />
        <div className="text-center text-accent-foreground">
          Incoming call to{' '}
          <span className="font-semibold text-foreground">
            <span role="img" aria-label="flag-mn">
              🇲🇳
            </span>
            erxes Mongolia
          </span>
        </div>
      </div>
      <div className="p-3 grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          className="text-destructive bg-destructive/10 hover:bg-destructive/15"
          onClick={onDeclineCall}
        >
          <IconPhoneEnd />
          Decline
        </Button>
        <Button
          variant="secondary"
          className="text-success bg-success/10 hover:bg-success/15"
          onClick={onAcceptCall}
        >
          <IconPhone />
          Answer
        </Button>
      </div>
    </>
  );
};
