import { IconAdjustments, IconSortDescending } from '@tabler/icons-react';
import { Button, Checkbox } from 'erxes-ui/components';
import { FilterDropdown } from './FilterDropdown';

export const ConversationFilter = () => {
  return (
    <div className="flex items-center pl-2">
      <Checkbox />
      <Button variant="ghost" size="icon" className="ml-auto">
        <IconSortDescending />
      </Button>
      <FilterDropdown />
    </div>
  );
};
