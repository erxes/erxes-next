import { formatInTimeZone } from 'date-fns-tz';

const now = new Date();

export const formatTimeZoneLabel = (ianaTimeZone: string) => {
  const offsetString = formatInTimeZone(now, ianaTimeZone, 'X');
  const offset = offsetString.replace('+', '').replace(':', '');
  const gmtFormat = offset.startsWith('0')
    ? `GMT+${parseInt(offset)}`
    : `GMT+${parseInt(offset)}`;
  return gmtFormat;
};
