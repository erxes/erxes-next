import { getDateValue } from 'erxes-ui/modules/filter/date-filter/utlis/getDateValue';
import { useFilterState } from 'erxes-ui/modules/filter/hooks/useFilterQueryStates';

export const useFilterDateState = (accessoryKey: string) => {
  const { value, setValue, condition, setCondition } = useFilterState(
    accessoryKey,
    {
      condition: 'before',
      state: '',
    }
  );

  return {
    stringDate: value,
    date: getDateValue(value),
    condition,
    setDate: setValue,
    setCondition,
  };
};
