import { useMultiQueryState } from 'erxes-ui/hooks';
import { getDateValue } from 'erxes-ui/modules/filter/date-filter/utlis/getDateValue';

export const useContactFilterValues = () => {
  const [dates] = useMultiQueryState([
    'createdAt',
    'modifiedAt',
    'lastSeenAt',
    'birthday',
  ]);

  const dateFilters = {};
  const activeFilters = {};

  // Object.entries(dates).forEach(([key, date]) => {
  //   if (dates[key]) {
  //     activeFilters[key] = date;
  //     if (date.condition === 'before') {
  //       dateFilters[key] = {
  //         lte: getDateValue(date.stringDate)?.from,
  //       };
  //     }
  //     if (date.condition === 'after') {
  //       dateFilters[key] = {
  //         gte: getDateValue(date.stringDate)?.from,
  //       };
  //     }
  //     if (date.condition === 'in') {
  //       dateFilters[key] = {
  //         gte: getDateValue(date.stringDate)?.from,
  //         lte: getDateValue(date.stringDate)?.to,
  //       };
  //     }
  //   }
  // });

  const dateValuesLength = Object.keys(dateFilters).map(
    (value) => value || '',
  )?.length;

  return {
    activeFilters,
    variables: {
      dateFilters: dateValuesLength ? JSON.stringify(dateFilters) : null,
    },
  };
};
