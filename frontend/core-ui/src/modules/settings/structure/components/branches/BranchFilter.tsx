import { Combobox, Filter } from 'erxes-ui';
import React from 'react';

export const BranchFilter = () => {
  return (
    <Filter.Popover scope="structure-branch-page">
      <Filter.Trigger />
      <Combobox.Content>
        <Filter.View>filter</Filter.View>
      </Combobox.Content>
    </Filter.Popover>
  );
};
