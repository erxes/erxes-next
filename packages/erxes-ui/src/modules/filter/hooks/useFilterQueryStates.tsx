import { useQueryState } from 'nuqs';
import { filterParser } from '../utils/filterParser';

export const useFilterState = (accessoryKey: string, withDefault?: any) => {
  const [filter, setFilter] = useQueryState(
    accessoryKey,
    filterParser
      .withDefault(withDefault || null)
      .withOptions({ history: 'push' })
  );

  const { state, condition } = filter || {};

  return {
    value: state,
    condition,
    setValue: (value) => setFilter({ condition, state: value }),
    setCondition: (value) => setFilter({ condition: value, state }),
    setFilter: (value) => setFilter(value),
  };
};
