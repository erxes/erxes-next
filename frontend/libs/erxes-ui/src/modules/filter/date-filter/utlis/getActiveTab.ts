import { MONTHS } from '../constants/dateTypes';

export const getActiveTab = (date: string) => {
  if (date.includes('half')) {
    return 'halfYear';
  }
  if (date.includes('quarter')) {
    return 'quarter';
  }
  if (MONTHS.some((month) => date.includes(month))) {
    return 'month';
  }
  if (date.includes('year')) {
    return 'year';
  }
  return 'day';
};
