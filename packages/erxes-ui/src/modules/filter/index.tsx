import {
  FilterBarCondition,
  FilterBarContainer,
  FilterBarField,
  FilterBarItem,
  FilterBarRemove,
  FilterBarSelectTrigger,
  FilterBarValue,
} from './componets/FilterBar';

export const FilterBar = Object.assign(FilterBarItem, {
  Container: FilterBarContainer,
  SelectTrigger: FilterBarSelectTrigger,
  Field: FilterBarField,
  Condition: FilterBarCondition,
  Value: FilterBarValue,
  Remove: FilterBarRemove,
});
