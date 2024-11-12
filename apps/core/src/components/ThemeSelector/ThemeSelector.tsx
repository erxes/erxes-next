import { DropdownMenu } from 'erxes-ui';
import { useTheme } from '../../providers/theme-provider';
import { ThemeOption } from '../../providers/theme-provider/theme-context';
import { SunIcon, MoonIcon, LaptopIcon } from 'lucide-react';

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger>
        <SunIcon />
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
              <SunIcon className="size-4 mr-2" />
              Light
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="dark">
              <MoonIcon className="size-4 mr-2" />
              Dark
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="system">
              <LaptopIcon className="size-4 mr-2" />
              System
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.SubContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Sub>
  );
};
