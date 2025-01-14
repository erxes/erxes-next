import { Select } from 'erxes-ui/components';

import { IconBox } from '@tabler/icons-react';
import { FilterBar } from 'erxes-ui/modules/filter-bar';

export const ProductFilterBarItem = () => {
  return (
    <FilterBar>
      <FilterBar.Field>
        <IconBox />
        Type
      </FilterBar.Field>
      <FilterBar.Condition>is</FilterBar.Condition>
      <FilterBar.Value>
        <Select.Content>
          <Select.Item value="product">Product</Select.Item>
          <Select.Item value="service">Service</Select.Item>
          <Select.Item value="unique">Unique</Select.Item>
          <Select.Item value="subscription">Subscription</Select.Item>
        </Select.Content>
      </FilterBar.Value>
      <FilterBar.Remove />
    </FilterBar>
  );
};

// field, condition, value, remove
