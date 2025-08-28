import { CallDirectionEnum } from '@/integrations/call/types/sipTypes';

export const extractPhoneNumberFromCounterpart = (counterpart: string) => {
  if (!counterpart) return '';
  const startIndex = counterpart.indexOf(':') + 1;
  const endIndex = counterpart.indexOf('@');
  if (startIndex >= endIndex || startIndex === -1 || endIndex === -1) return '';
  return counterpart.slice(startIndex, endIndex);
};

export function parseCallDirection(
  direction: string | null,
): CallDirectionEnum {
  if (!direction) return CallDirectionEnum.OUTGOING;
  const parts = direction.split('/');
  if (parts.length > 1) {
    return parts[1].toLowerCase() as CallDirectionEnum;
  }
  return direction.toLowerCase() as CallDirectionEnum;
}

export const logger = {
  log: (a: any) => {
    console.log(a, 'log a***');
  },
  error: (e: any) => {
    console.error(e, 'error');
  },
  warn: (w: any) => {
    console.warn(w, 'warn');
  },
  debug: (d: any, e?: any) => {
    console.debug(d, 'debug', e);
  },
};

export function formatSeconds(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hrs, mins, secs].map((v) => String(v).padStart(2, '0')).join(':');
}
