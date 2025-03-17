import { endOfDay, startOfDay, subDays } from 'date-fns';
import { MONTHS } from 'erxes-ui/modules/filter/date-filter/constants/dateTypes';

export const parseDateRangeFromString = (
  date: string,
): { from: Date; to: Date } | undefined => {
  const today = new Date();

  // Predefined date ranges
  const dateRanges: Record<string, { from: Date; to: Date }> = {
    today: {
      from: startOfDay(today),
      to: endOfDay(today),
    },
    yesterday: {
      from: startOfDay(subDays(today, 1)),
      to: endOfDay(subDays(today, 1)),
    },
    'last-7-days': {
      from: startOfDay(subDays(today, 7)),
      to: endOfDay(today),
    },
    'last-30-days': {
      from: startOfDay(subDays(today, 30)),
      to: endOfDay(today),
    },
    thisWeek: {
      from: startOfDay(
        new Date(today.setDate(today.getDate() - today.getDay())),
      ),
      to: endOfDay(new Date()),
    },
    thisMonth: {
      from: startOfDay(new Date(today.getFullYear(), today.getMonth(), 1)),
      to: endOfDay(new Date()),
    },
  };

  // Check for predefined ranges
  if (dateRanges[date]) {
    return dateRanges[date];
  }

  // Month format: YYYY-MMM
  if (MONTHS.some((month) => date.includes(month))) {
    const [year, month] = date.split('-');
    const monthIndex = MONTHS.indexOf(month);
    return {
      from: startOfDay(new Date(parseInt(year), monthIndex, 1)),
      to: endOfDay(new Date(parseInt(year), monthIndex + 1, 0)),
    };
  }

  // Quarter format: YYYY-quarterN
  if (date.includes('quarter')) {
    const [year] = date.split('-');
    const quarterNumber = parseInt(date.split('quarter')[1]);
    return {
      from: startOfDay(new Date(parseInt(year), (quarterNumber - 1) * 3, 1)),
      to: endOfDay(new Date(parseInt(year), quarterNumber * 3, 0)),
    };
  }

  // Half year format: YYYY-halfN
  if (date.includes('half')) {
    const [year] = date.split('-');
    const halfNumber = parseInt(date.split('half')[1]);
    return {
      from: startOfDay(new Date(parseInt(year), (halfNumber - 1) * 6, 1)),
      to: endOfDay(new Date(parseInt(year), halfNumber * 6, 0)),
    };
  }

  // Year format: YYYY
  if (/^\d{4}$/.test(date)) {
    const year = parseInt(date);
    return {
      from: startOfDay(new Date(year, 0, 1)),
      to: endOfDay(new Date(year, 11, 31)),
    };
  }

  // Date range format: fromDate,toDate
  if (date.includes(',')) {
    const [from, to] = date.split(',');
    return {
      from: startOfDay(new Date(from)),
      to: endOfDay(new Date(to)),
    };
  }

  return undefined;
};
