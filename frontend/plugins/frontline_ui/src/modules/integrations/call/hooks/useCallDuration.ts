import { callDurationAtom } from '@/integrations/call/states/callStates';
import { intervalToDuration } from 'date-fns';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

export const useCallDuration = () => {
  const startDate = useAtomValue(callDurationAtom);
  const [time, setTime] = useState('00:00');

  useEffect(() => {
    if (!startDate) return;
    const interval = setInterval(() => {
      const now = new Date();
      if (!startDate) return;
      const duration = intervalToDuration({ start: startDate, end: now });
      const minutes = String(duration.minutes ?? 0).padStart(2, '0');
      const seconds = String(duration.seconds ?? 0).padStart(2, '0');

      setTime(`${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  return time;
};
