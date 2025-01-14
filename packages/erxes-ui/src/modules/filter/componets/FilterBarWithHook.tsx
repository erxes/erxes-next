import {
  FilterBarContainer,
  FilterBarItem,
  FilterBarField,
  FilterBarRemove,
} from './FilterBar';
import { Filter } from 'erxes-ui/modules/filter/types/filter';
import { Button } from 'erxes-ui/components';
import { parseAsString, useQueryStates } from 'nuqs';

export const FilterBarWithHook = ({ filters }: { filters: Filter[] }) => {
  const queryKeys = filters.reduce((acc, filter) => {
    acc[filter.accessoryKey] = parseAsString.withDefault('');
    return acc;
  }, {});
  const [activeQueryValues] = useQueryStates(queryKeys);

  if (!Object.values(activeQueryValues).some((value) => !!value)) {
    return null;
  }

  return (
    <FilterBarContainer>
      {filters.map((filter) => (
        <FilterBarItemWithHook
          key={filter.accessoryKey}
          queryKeys={queryKeys}
          {...filter}
        />
      ))}
    </FilterBarContainer>
  );
};

const FilterBarItemWithHook = ({
  accessoryKey,
  label,
  type,
  condition,
  queryKeys,
  bar,
  ...props
}: Filter & { queryKeys: Record<string, any> }) => {
  const [filter, setFilter] = useQueryStates(queryKeys);

  const value = filter[accessoryKey];

  if (!value) {
    return null;
  }

  return (
    <FilterBarItem>
      <FilterBarField>
        <props.icon />
        {label}
      </FilterBarField>
      <FilterBarConditionWithHook
        accessoryKey={accessoryKey}
        condition={condition}
      />
      {bar({ ...props, accessoryKey, label, type, condition })}
      <FilterBarRemove
        onClick={() => setFilter({ ...filter, [accessoryKey]: null })}
      />
    </FilterBarItem>
  );
};

const FilterBarConditionWithHook = ({
  accessoryKey,
  condition,
}: Pick<Filter, 'accessoryKey' | 'condition'>) => {
  return (
    <Button variant="ghost" className="px-2 bg-background rounded-none">
      {condition}
    </Button>
  );
};
