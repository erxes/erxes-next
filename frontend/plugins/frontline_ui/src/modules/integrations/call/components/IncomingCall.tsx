import { useSip } from '@/integrations/call/components/SipProvider';
import { sipStateAtom } from '@/integrations/call/states/sipStates';
import { extractPhoneNumberFromCounterpart } from '@/integrations/call/utils/callUtils';
import { IconPhone, IconPhoneEnd } from '@tabler/icons-react';
import { Button, formatPhoneNumber, getPluginAssetsUrl } from 'erxes-ui';
import { useAtomValue } from 'jotai';

export const IncomingCall = ({ children }: { children: React.ReactNode }) => {
  const sipState = useAtomValue(sipStateAtom);
  const { answerCall, stopCall } = useSip();
  const phoneNumber = extractPhoneNumberFromCounterpart(
    sipState?.callCounterpart || '',
  );

  return (
    <>
      <audio
        loop
        autoPlay
        className="sr-only"
        src={getPluginAssetsUrl('frontline', '/sound/incoming.mp3')}
      />
      <div className="text-center">{children}</div>
      <div className="mt-2 px-3 mb-1 space-y-2">
        <div className="font-semibold text-lg text-primary text-center">
          {formatPhoneNumber({ value: phoneNumber, defaultCountry: 'MN' })}
        </div>
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
          onClick={stopCall}
        >
          <IconPhoneEnd />
          Decline
        </Button>
        <Button
          variant="secondary"
          className="text-success bg-success/10 hover:bg-success/15"
          onClick={answerCall}
        >
          <IconPhone />
          Answer
        </Button>
      </div>
    </>
  );
};
