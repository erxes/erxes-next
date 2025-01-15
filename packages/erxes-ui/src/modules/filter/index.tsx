import {
  FilterBarContainer,
  FilterBarItem,
  FilterBarField,
  FilterBarCondition,
  FilterBarValue,
  FilterBarRemove,
  FilterBarSelectTrigger,
} from './componets/FilterBar';

export const FilterBar = Object.assign(FilterBarItem, {
  Container: FilterBarContainer,
  SelectTrigger: FilterBarSelectTrigger,
  Field: FilterBarField,
  Condition: FilterBarCondition,
  Value: FilterBarValue,
  Remove: FilterBarRemove,
});
