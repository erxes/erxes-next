import { Filter } from 'erxes-ui/modules/filter/types/filter';

import { FilterBar } from './FilterBar';
import { useFilterState } from '../hooks/useFilterQueryStates';

export const FilterBarWithHookRoot = ({
  activeFilters,
}: {
  activeFilters: Filter[];
}) => {
  if (!activeFilters.length) {
    return null;
  }

  return (
    <FilterBar>
      {activeFilters.map((filter) => (
        <FilterBarItemWithHook key={filter.accessoryKey} {...filter} />
      ))}
    </FilterBar>
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
    <FilterBar.Item>
      <FilterBar.Field>
        <props.icon />
        {label}
      </FilterBar.Field>
      {condition({ ...props, accessoryKey, label, condition })}
      {bar({ ...props, accessoryKey, label, condition })}
      <FilterBar.Remove onClick={() => setFilter(null)} />
    </FilterBar.Item>
  ) : null;
};

export const FilterBarWithHook = Object.assign(FilterBarWithHookRoot, {
  Item: FilterBarItemWithHook,
});
