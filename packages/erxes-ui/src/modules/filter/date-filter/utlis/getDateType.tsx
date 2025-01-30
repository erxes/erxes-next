import { isValid,parseISO } from 'date-fns';

import { MONTHS } from 'erxes-ui/modules/filter/date-filter/constants/dateTypes';

export const getDateType = (
  value?: string
): {
  isISODateString: boolean;
  period: string;
  isMonth: boolean;
  isHalfYear: boolean;
  isQuarter: boolean;
  isYear: boolean;
  year: number;
  getFirstMatch: ({
    date,
    year,
    half,
    quarter,
    month,
  }: {
    date: () => any;
    year: () => any;
    half: () => any;
    quarter: () => any;
    month: () => any;
  }) => any;
} => {
  const [year, period] = value?.split('-') || [];
  const numericYear = parseInt(year);

  const getFirstMatch = ({ date, year, half, quarter, month }) => {
    if (isISODateString(value)) return date();
    if (period?.includes('y')) return year();
    if (period?.includes('H')) return half();
    if (period?.includes('Q')) return quarter();
    if (MONTHS.includes(period)) return month();
  };

  return {
    isISODateString: isISODateString(value),
    period,
    isMonth: MONTHS.includes(period),
    isHalfYear: period?.includes('H'),
    isQuarter: period?.includes('Q'),
    isYear: period?.includes('y'),
    year: numericYear,
    getFirstMatch,
  };
};

function isISODateString(value) {
  try {
    // Attempt to parse the string as an ISO date
    const parsedDate = parseISO(value);
    // Check if the parsed date is valid
    return isValid(parsedDate);
  } catch (error) {
    // If parseISO throws an error, return false
    return false;
  }
}
