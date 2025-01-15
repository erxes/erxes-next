import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import { IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { DropdownMenu, Button } from 'erxes-ui/components';
import { useState } from 'react';

export const FilterDropdown = ({ filters }: { filters: any[] }) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" className="px-2">
          <IconAdjustmentsHorizontal className="w-4 h-4" />
          Filter
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Tabs>
          <DropdownMenu.TabsContent>
            {filters.map((filter) => (
              <DropdownMenu.TabsTrigger
                value={filter.accessoryKey}
                key={filter.accessoryKey}
              >
                <filter.icon />
                {filter.label}
                <IconChevronRight className="w-4 h-4 ml-auto" />
              </DropdownMenu.TabsTrigger>
            ))}
          </DropdownMenu.TabsContent>
          {filters.map((filter) => (
            <DropdownMenu.TabsContent value={filter.accessoryKey}>
              <DropdownMenu.TabsTrigger>
                <IconChevronLeft className="w-4 h-4 mr-2" />
                Back
              </DropdownMenu.TabsTrigger>
              {<filter.dropdown onOpenChange={setOpen} {...filter} />}
            </DropdownMenu.TabsContent>
          ))}
        </DropdownMenu.Tabs>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
