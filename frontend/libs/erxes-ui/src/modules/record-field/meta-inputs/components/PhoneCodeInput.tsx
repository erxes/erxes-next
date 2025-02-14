import { useState } from 'react';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import { Button, Command, Popover } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib/utils';
import { CountryPhoneCodes } from 'erxes-ui/constants/CountryPhoneCodes';

interface PhoneCodeInputProps {
  value: string | undefined;
  onChange: (value: string) => void;
  className?: string;
}

export const PhoneCodeInput = ({
  value,
  onChange,
  className,
}: PhoneCodeInputProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const currentCountry = CountryPhoneCodes?.find(
    (country) => country.dial_code === value,
  );

  const handleSelect = (phoneCode: string) => {
    setOpen(false);
    onChange(phoneCode);
  };

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen} modal>
        <Popover.Trigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="truncate rounded-none h-8 hover:cursor-pointer shadow-none w-full justify-between border-none focus:outline-none focus:ring-[3px] focus:shadow-primary/10 focus:z-50"
          >
            <span
              className={cn(
                'truncate',
                !currentCountry && 'text-foreground font-medium text-sm',
              )}
            >
              {currentCountry ? (
                <span>{currentCountry.flag}</span>
              ) : (
                'Select country'
              )}
            </span>
            <IconChevronDown
              size={16}
              strokeWidth={2}
              className="shrink-0 text-foreground"
              aria-hidden="true"
            />
          </Button>
        </Popover.Trigger>
        <Popover.Content
          className="w-56 min-w-[var(--radix-popper-anchor-width)] border p-0"
          align="start"
          sideOffset={4}
        >
          <Command id="vendor-command-menu">
            <Command.Input
              variant="secondary"
              wrapperClassName="flex-auto"
              placeholder="Search vendor..."
              className="h-9"
            />
            <Command.List>
              <Command.Group>
                {CountryPhoneCodes.map((country) => (
                  <Command.Item
                    key={country.code}
                    className="h-7 relative flex items-center justify-between"
                    value={country.dial_code}
                    onSelect={() => handleSelect(country.dial_code)}
                    title={country.name}
                  >
                    <span className="text-xs text-foreground truncate">
                      {country.flag} {country.name} 
                      <span className='text-muted-foreground ml-2'>{country.dial_code}</span>
                    </span>
                    {currentCountry?.code === country.code && (
                      <IconCheck
                        size={16}
                        strokeWidth={2}
                        className="ml-auto"
                      />
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover>
    </div>
  );
};
