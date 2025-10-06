import { IncomingHttpHeaders } from 'http';

export const getTimezone = (req: IncomingHttpHeaders): string => {
  const timezone = req['x-timezone'] || req['timezone'] || 'UTC';

  if (Array.isArray(timezone)) {
    return timezone[0];
  }

  return timezone;
};
