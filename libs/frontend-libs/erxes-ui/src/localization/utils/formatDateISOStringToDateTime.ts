import { formatInTimeZone } from 'date-fns-tz';

import { DateFormat } from '../constants/DateFormat';
import { TimeFormat } from '../constants/TimeFormat';

export const formatDateISOStringToDateTime = (
  date: string,
  timeZone: string,
  dateFormat: DateFormat,
  timeFormat: TimeFormat
) => {
  return formatInTimeZone(
    new Date(date),
    timeZone,
    `${dateFormat} ${timeFormat}`
  );
};
