import { IconAdjustments } from '@tabler/icons-react';
import { Button, DropdownMenu } from 'erxes-ui';

export const FilterDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="data-[state=open]:bg-accent"
        >
          <IconAdjustments />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Tabs>
          <DropdownMenu.TabsContent>
            <DropdownMenu.TabsTrigger value="date">
              Filter by date
            </DropdownMenu.TabsTrigger>
          </DropdownMenu.TabsContent>
          <DropdownMenu.TabsContent value="date">
            <DropdownMenu.RadioGroup>
              <DropdownMenu.RadioItem value="today">
                Today
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="yesterday">
                Yesterday
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="thisWeek">
                This week
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="thisMonth">
                This month
              </DropdownMenu.RadioItem>
              <DropdownMenu.Separator />
              <DropdownMenu.Item>Custom</DropdownMenu.Item>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.TabsContent>
        </DropdownMenu.Tabs>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
