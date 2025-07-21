'use client';

import React, { useState } from 'react';
import {
  Avatar,
  Combobox,
  Command,
  Skeleton,
  TextOverflowTooltip,
  SelectTree,
} from 'erxes-ui';
import { LANGUAGES } from '../../../constants';

interface Language {
  value: string;
  label: string;
  code: string;
}

export const SelectLanguage = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  React.ComponentPropsWithoutRef<typeof Combobox.Trigger> & {
    selected?: string;
    onSelect: (languageCode: string) => void;
    open?: boolean;
    setOpen?: (open: boolean) => void;
    id?: string;
  }
>(({ onSelect, selected, id, ...props }, ref) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>();

  React.useEffect(() => {
    const language = LANGUAGES.find((lang) => lang.value === selected);
    setSelectedLanguage(language);
  }, [selected]);

  const handleSelect = (languageCode: string) => {
    const language = LANGUAGES.find((lang) => lang.value === languageCode);
    setSelectedLanguage(language);
    onSelect(languageCode);
  };

  return (
    <SelectTree id={id || 'select-language'}>
      <SelectLanguageTrigger
        ref={ref}
        {...props}
        selectedLanguage={selectedLanguage}
      />
      <Combobox.Content>
        <Command className="outline-none">
          <Command.Input />
          <Command.List>
            <Combobox.Empty />
            {LANGUAGES.map((language) => (
              <SelectLanguageItem
                key={language.value}
                language={language}
                selected={selectedLanguage?.value === language.value}
                onSelect={handleSelect}
              />
            ))}
          </Command.List>
        </Command>
      </Combobox.Content>
    </SelectTree>
  );
});

export const SelectLanguageItem = ({
  language,
  selected,
  onSelect,
}: {
  language: Language;
  selected: boolean;
  onSelect: (languageCode: string) => void;
}) => {
  const { value, label, code } = language;
  const firstLetter = label.charAt(0);

  return (
    <SelectTree.Item
      _id={value}
      name={label}
      value={code + label}
      onSelect={() => onSelect(value)}
      selected={selected}
    >
      <SelectLanguageBadge language={language} selected={selected} />
    </SelectTree.Item>
  );
};

export const SelectLanguageBadge = ({
  language,
  selected,
}: {
  language?: Language;
  selected?: boolean;
}) => {
  if (!language) return null;
  const { label, code } = language;
  const firstLetter = label.charAt(0);

  return (
    <>
      <div className="flex items-center gap-2 flex-auto overflow-hidden justify-start">
        <Avatar>
          <Avatar.Fallback>{firstLetter}</Avatar.Fallback>
        </Avatar>
        <div className="text-muted-foreground">{code}</div>
        <TextOverflowTooltip value={label} className="flex-auto" />
      </div>
      {selected && <Combobox.Check checked={selected} />}
    </>
  );
};

export const SelectLanguageTrigger = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  React.ComponentPropsWithoutRef<typeof Combobox.Trigger> & {
    selectedLanguage: Language | undefined;
  }
>(({ selectedLanguage, className, ...props }, ref) => {
  return (
    <Combobox.Trigger ref={ref} className={className} {...props}>
      <SelectLanguageBadge language={selectedLanguage} />
      {!selectedLanguage && <Combobox.Value placeholder="Select language" />}
    </Combobox.Trigger>
  );
});
