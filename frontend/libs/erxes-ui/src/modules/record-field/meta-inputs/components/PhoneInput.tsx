import { useState, useRef } from 'react';
import { IconCheck, IconWorld } from '@tabler/icons-react';
import { Button, Command, Popover } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';
import parsePhoneNumberFromString, { CountryCode } from 'libphonenumber-js';
import { CountryPhoneCodes } from 'erxes-ui/constants/CountryPhoneCodes';
import { TextFieldInput } from './TextFieldInput';
import { TCountryCode } from 'erxes-ui/types';
import { formatPhoneNumber } from 'erxes-ui/utils/format';

interface PhoneInputProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultCountry?: CountryCode;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  className,
  defaultCountry,
}) => {
  let parsedNumber;
  try {
    parsedNumber = parsePhoneNumberFromString(value || '', {
      defaultCountry: defaultCountry || undefined,
    });
  } catch {
    parsedNumber = null;
  }

  const initialCountry = parsedNumber?.country || defaultCountry;
  const [selectedCountry, setSelectedCountry] = useState<
    TCountryCode | undefined
  >(CountryPhoneCodes.find((c) => c.code === initialCountry));

  const initialValue = value
    ? parsedNumber
      ? parsedNumber.formatInternational()
      : value
    : selectedCountry?.dial_code;
  const [phoneNumber, setPhoneNumber] = useState<string>(
    formatPhoneNumber({ value: initialValue || value || '' }),
  );

  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<React.ElementRef<typeof TextFieldInput>>(null);

  const handleSelect = (phoneCode: string) => {
    const country = CountryPhoneCodes.find((c) => c.dial_code === phoneCode);
    if (country) {
      setSelectedCountry(country);
      setPhoneNumber(country.dial_code);
    }
    setOpen(false);
    inputRef.current?.focus();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    let parsedNumber;
    try {
      parsedNumber = parsePhoneNumberFromString(input);
    } catch {
      parsedNumber = null;
    }

    const countryCode = parsedNumber?.country;
    if (countryCode) {
      setSelectedCountry(CountryPhoneCodes.find((c) => c.code === countryCode));
    }

    setPhoneNumber(
      formatPhoneNumber({
        defaultCountry: selectedCountry?.code as CountryCode,
        value: input,
      }),
    );
    onChange(input);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="rounded-none shadow-none border-x h-cell focus:z-50 focus:ring-[3px] focus:shadow-primary/10"
          >
            {selectedCountry ? (
              <span>{selectedCountry.flag}</span>
            ) : (
              <IconWorld size={16} />
            )}
          </Button>
        </Popover.Trigger>
        <Popover.Content className="w-[300px] p-0" align="start">
          <Command>
            <Command.Input placeholder="Search country..." className="h-9" />
            <Command.List className="max-h-[300px] overflow-auto">
              <Command.Group>
                {CountryPhoneCodes.map((country) => (
                  <Command.Item
                    key={country.code}
                    value={country.name}
                    onSelect={() => handleSelect(country.dial_code)}
                    className="flex items-center justify-between px-2 py-1.5"
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{country.flag}</span>
                      <span className="text-sm">{country.name}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        {country.dial_code}
                      </span>
                    </div>
                    {selectedCountry?.code === country.code && (
                      <IconCheck className="h-4 w-4" />
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover>

      <TextFieldInput
        value={phoneNumber}
        onChange={handlePhoneChange}
        ref={inputRef}
        className={cn(
          'flex h-cell w-full text-sm border-0 shadow-none',
          className,
        )}
      />
    </>
  );
};
