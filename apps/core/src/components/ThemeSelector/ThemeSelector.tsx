import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from 'erxes-ui';
import { useTheme } from '../../providers/theme-provider';
import { ThemeOption } from '../../providers/theme-provider/theme-context';

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <DropdownMenuLabel>Theme</DropdownMenuLabel>
      <DropdownMenuRadioGroup
        value={theme}
        onValueChange={(value) => setTheme(value as ThemeOption)}
      >
        <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
      <DropdownMenuSeparator />
    </>
  );
};
