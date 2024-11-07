import {
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSubTrigger,
} from 'erxes-ui';
import { LanguagesIcon } from 'lucide-react';
import { AvailableLanguage, useSwitchLanguage } from '../../i18n';

export const SelectLanguages = () => {
  const { currentLanguage, languages, switchLanguage } = useSwitchLanguage();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <LanguagesIcon />
        <span>Language ({currentLanguage})</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuLabel>Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={currentLanguage}
            onValueChange={(value) =>
              switchLanguage(value as AvailableLanguage)
            }
          >
            {languages.map((language) => (
              <DropdownMenuRadioItem key={language} value={language}>
                {language}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};
