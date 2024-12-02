import { DateFormat } from '../constants/DateFormat';
import { TimeFormat } from '../constants/TimeFormat';
import { detectTimeZone } from '../utils/detectTimeZone';
import { createState } from '@/utils';

export const dateTimeFormatState = createState<{
  timeZone: string;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
}>({
  key: 'dateTimeFormatState',
  defaultValue: {
    timeZone: detectTimeZone(),
    dateFormat: DateFormat.MONTH_FIRST,
    timeFormat: TimeFormat['HOUR_24'],
  },
});
