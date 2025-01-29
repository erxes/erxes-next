import { format, parseISO } from 'date-fns';

import { getDateType } from './getDateType';

export const getDateLabel = (value: string): string | number => {
  const { getFirstMatch, year, period } = getDateType(value);

  return getFirstMatch({
    date: () => format(parseISO(value), 'MMMM dd, yyyy'),
    year: () => year,
    half: () => `${year} ${period}`,
    quarter: () => `${year} ${period}`,
    month: () => `${period} ${year}`,
  });
};
