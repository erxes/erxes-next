import { formatInTimeZone } from 'date-fns-tz';

import { DateFormat } from '../constants/DateFormat';

export const formatDateISOStringToDate = (
  date: string,
  timeZone: string,
  dateFormat: DateFormat
) => {
  return formatInTimeZone(new Date(date), timeZone, `${dateFormat}`);
};
