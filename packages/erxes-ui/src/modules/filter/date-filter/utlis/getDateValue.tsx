import { addDays, addMilliseconds, parseISO } from 'date-fns';
import { getDateType } from 'erxes-ui/modules/filter/date-filter/utlis/getDateType';
import { MONTHS } from 'erxes-ui/modules/filter/date-filter/constants/dateTypes';

export function getDateValue(value: string): { from: Date; to: Date } | null {
  const {
    isISODateString,
    year,
    period,
    isQuarter,
    isMonth,
    isHalfYear,
    isYear,
  } = getDateType(value);

  if (isISODateString) {
    const date = parseISO(value);
    return {
      from: date,
      to: addMilliseconds(addDays(date, 1), -1),
    };
  }

  if (isQuarter) {
    const quarter = parseInt(period.replace('Q', ''));
    const startMonth = (quarter - 1) * 3;
    return {
      from: new Date(year, startMonth, 1),
      to: new Date(year, startMonth + 3, 0),
    };
  }

  if (isMonth) {
    const month = MONTHS.indexOf(period);
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
