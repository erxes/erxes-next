import { DATE_FORMAT_WITHOUT_YEAR } from '../constants/DateFormatWithoutYear';
import { TimeFormat } from '../constants/TimeFormat';
import { detectDateFormat } from '../utils/detectDateFormat';
import { formatInTimeZone } from 'date-fns-tz';

export const formatDateISOStringToDateTimeSimplified = (
  date: Date,
  timeZone: string,
  timeFormat: TimeFormat
) => {
  const simplifiedDateFormat = DATE_FORMAT_WITHOUT_YEAR[detectDateFormat()];

  return formatInTimeZone(
    date,
    timeZone,
    `${simplifiedDateFormat} · ${timeFormat}`
  );
};
