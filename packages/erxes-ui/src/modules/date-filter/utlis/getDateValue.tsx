import { parseISO } from 'date-fns';
import { getDateType } from './getDateType';

interface DateRange {
  from: Date;
  to: Date;
}

export function getDateValue(value: string): DateRange | Date | null {
  const {
    isISODateString,
    year,
    period,
    isQuarter,
    isMonth,
    isHalfYear,
    isYear,
  } = getDateType(value);

  if (isISODateString) return parseISO(value);

  if (isQuarter) {
    const quarter = parseInt(period.replace('Q', ''));
    const startMonth = (quarter - 1) * 3;
    return {
      from: new Date(year, startMonth, 1),
      to: new Date(year, startMonth + 3, 0),
    };
  }

  if (isMonth) {
    const month = parseInt(period) - 1;
    return {
      from: new Date(year, month, 1),
      to: new Date(year, month + 1, 0),
    };
  }

  if (isHalfYear) {
    const half = parseInt(period.replace('H', ''));
    const startMonth = (half - 1) * 6;
    return {
      from: new Date(year, startMonth, 1),
      to: new Date(year, startMonth + 6, 0),
    };
  }

  if (isYear) {
    return {
      from: new Date(year, 0, 1),
      to: new Date(year, 11, 31),
    };
  }

  return null;
}
