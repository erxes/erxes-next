import { Filter } from 'erxes-ui/modules/filter/types/filter';

import {
  FilterBarContainer,
  FilterBarField,
  FilterBarItem,
  FilterBarRemove,
} from './FilterBar';
import { useFilterState } from '../hooks/useFilterQueryStates';

export const FilterBarWithHook = ({
  activeFilters,
}: {
  activeFilters: Filter[];
}) => {
  if (!activeFilters.length) {
    return null;
  }

  return (
    <FilterBarContainer>
      {activeFilters.map((filter) => (
        <FilterBarItemWithHook key={filter.accessoryKey} {...filter} />
      ))}
    </FilterBarContainer>
  );
};

const FilterBarItemWithHook = ({
  accessoryKey,
  label,
  condition,
  bar,
  ...props
}: Filter) => {
  const { value, setFilter } = useFilterState(accessoryKey);

  return value ? (
    <FilterBarItem>
      <FilterBarField>
        <props.icon />
        {label}
      </FilterBarField>
      {condition({ ...props, accessoryKey, label, condition })}
      {bar({ ...props, accessoryKey, label, condition })}
      <FilterBarRemove onClick={() => setFilter(null)} />
    </FilterBarItem>
  ) : null;
};
