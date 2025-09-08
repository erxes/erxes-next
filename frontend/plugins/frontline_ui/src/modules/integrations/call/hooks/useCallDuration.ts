import { callDurationAtom } from '@/integrations/call/states/callStates';
import { intervalToDuration } from 'date-fns';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

export const useCallDuration = () => {
  const startDate = useAtomValue(callDurationAtom);
  const time = useCallDurationFromDate(startDate);

  return time;
};

export const useCallDurationFromDate = (date: Date | null) => {
  const [time, setTime] = useState('00:00');

  useEffect(() => {
    if (!date) return;
    const interval = setInterval(() => {
      const now = new Date();
      if (!date) return;
      const duration = intervalToDuration({ start: date, end: now });
      const minutes = String(duration.minutes ?? 0).padStart(2, '0');
      const seconds = String(duration.seconds ?? 0).padStart(2, '0');

      setTime(`${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [date]);

  return time;
};
