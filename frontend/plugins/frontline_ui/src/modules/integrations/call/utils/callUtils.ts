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
