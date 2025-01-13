import {
  FilterBarContainer,
  FilterBarItem,
  FilterBarField,
  FilterBarCondition,
  FilterBarValue,
  FilterBarRemove,
} from './componets/FilterBar';

export const FilterBar = Object.assign(FilterBarItem, {
  Container: FilterBarContainer,
  Field: FilterBarField,
  Condition: FilterBarCondition,
  Value: FilterBarValue,
  Remove: FilterBarRemove,
});
