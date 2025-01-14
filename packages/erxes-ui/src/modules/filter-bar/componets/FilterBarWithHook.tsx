import { Select } from 'erxes-ui/components/select';
import { useAddFilter } from 'erxes-ui/modules/filter-bar/hooks/useAddFilter';
import {
  FilterBarContainer,
  FilterBarItem,
  FilterBarField,
  FilterBarRemove,
  FilterBarSelectTrigger,
} from './FilterBar';
import { Filter } from 'erxes-ui/modules/filter-bar/types/filter';
import { Button, Input } from 'erxes-ui/components';
import { parseAsString, useQueryState, useQueryStates } from 'nuqs';

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
  options,
  condition,
  queryKeys,
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
      <FilterBarValueWithHook
        accessoryKey={accessoryKey}
        type={type}
        options={options}
        value={value}
        onValueChange={(value) =>
          setFilter({ ...filter, [accessoryKey]: value })
        }
      />
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

const FilterBarValueWithHook = ({
  accessoryKey,
  type,
  options,
  value,
  onValueChange,
}: Pick<Filter, 'accessoryKey' | 'type' | 'options'> & {
  value: string;
  onValueChange: (value: string) => void;
}) => {
  if (type === 'input') {
    return <Input className="w-full rounded-none h-7" />;
  }

  if (type === 'select') {
    return (
      <Select value={value} onValueChange={onValueChange}>
        <FilterBarSelectTrigger>
          <Select.Value />
        </FilterBarSelectTrigger>
        <Select.Content>
          {options.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    );
  }

  return null;
};
