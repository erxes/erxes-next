import { IFilter } from 'erxes-ui/modules/filter/types/filter';

import { FilterBar } from './FilterBar';
import { useQueryState } from 'erxes-ui/hooks';

export const FilterBarWithHookRoot = ({
  activeFilters,
}: {
  activeFilters: IFilter[];
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
}: IFilter) => {
  const [value, setFilter] = useQueryState(accessoryKey);

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
