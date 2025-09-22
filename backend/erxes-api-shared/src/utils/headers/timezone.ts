import { IncomingHttpHeaders } from 'http';

export const getTimezone = (req: IncomingHttpHeaders) => {
  return req['x-timezone'] || req['timezone'] || 'UTC';
};
