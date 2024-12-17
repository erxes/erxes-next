import { DropdownMenu } from 'erxes-ui/components';
import { IconLanguage } from '@tabler/icons-react';
import { AvailableLanguage, useSwitchLanguage } from '~/i18n';

export const SelectLanguages = () => {
  const { currentLanguage, languages, switchLanguage } = useSwitchLanguage();

  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger>
        <IconLanguage />
        <span>Language ({currentLanguage})</span>
      </DropdownMenu.SubTrigger>
      <DropdownMenu.Portal>
        <DropdownMenu.SubContent>
          <DropdownMenu.Label>Language</DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.RadioGroup
            value={currentLanguage}
            onValueChange={(value) =>
              switchLanguage(value as AvailableLanguage)
            }
          >
            {languages.map((language) => (
              <DropdownMenu.RadioItem key={language} value={language}>
                {language}
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.SubContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Sub>
  );
};
