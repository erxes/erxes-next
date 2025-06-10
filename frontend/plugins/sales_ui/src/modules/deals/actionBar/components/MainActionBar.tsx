import { Button, DropdownMenu } from 'erxes-ui';
import { IconAdjustmentsHorizontal, IconFilter } from '@tabler/icons-react';

const MainActionBar = () => {
  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <div className="flex items-center gap-2 bg-sidebar cursor-pointer">
            <IconFilter className="w-4 h-4" /> Filter
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Group>
            <DropdownMenu.Item>
              Profile
              <DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              Billing
              <DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              Settings
              <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              Keyboard shortcuts
              <DropdownMenu.Shortcut>⌘K</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.Item>Team</DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu>

      <div className="gap-2">
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button className="flex-none pr-2" variant="outline">
              <IconAdjustmentsHorizontal className="w-4 h-4" /> Display
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Resolve</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MainActionBar;
