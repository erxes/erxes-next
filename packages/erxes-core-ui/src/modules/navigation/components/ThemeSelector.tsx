import { IconDevices, IconMoon, IconSun } from '@tabler/icons-react';

import { DropdownMenu } from 'erxes-ui/components';
import { useTheme, Theme } from 'erxes-ui/modules/theme-provider';
export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger>
        <IconSun />
        <span className="flex-1 flex items-center justify-between">
          Theme <span className="text-muted-foreground">{theme}</span>
        </span>
      </DropdownMenu.SubTrigger>
      <DropdownMenu.Portal>
        <DropdownMenu.SubContent className="min-w-32">
          <DropdownMenu.RadioGroup
            value={theme}
            onValueChange={(value) => setTheme(value as Theme)}
          >
            <DropdownMenu.RadioItem value="light">
              <IconSun className="size-4 mr-2" />
              Light
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="dark">
              <IconMoon className="size-4 mr-2" />
              Dark
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="system">
              <IconDevices className="size-4 mr-2" />
              System
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.SubContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Sub>
  );
};
