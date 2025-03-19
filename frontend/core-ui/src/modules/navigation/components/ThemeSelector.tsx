import { IconDevices, IconMoon, IconSun } from '@tabler/icons-react';

import { DropdownMenu } from 'erxes-ui';
import { ThemeOption, themeState } from 'erxes-ui';
import { useAtom } from 'jotai';

export const ThemeSelector = () => {
  const [theme, setTheme] = useAtom(themeState);
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
            onValueChange={(value) => setTheme(value as ThemeOption)}
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
