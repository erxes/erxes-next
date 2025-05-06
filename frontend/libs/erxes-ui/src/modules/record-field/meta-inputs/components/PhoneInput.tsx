import React, { useState } from 'react';
import { IconCheck } from '@tabler/icons-react';
import { Button, Command, Input, Popover } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';
import parsePhoneNumberFromString, { CountryCode } from 'libphonenumber-js';
import { CountryPhoneCodes } from 'erxes-ui/constants/CountryPhoneCodes';
import { TCountryCode } from 'erxes-ui/types';
import { formatPhoneNumber } from 'erxes-ui/utils/format';

interface PhoneInputProps {
  value?: string;
  onChange: (value: string, defaultCountryCode: CountryCode) => void;
  className?: string;
  defaultCountry?: CountryCode;
  placeholder?: string;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, className, defaultCountry, placeholder }, ref) => {
    const defaultCountryCode =
      defaultCountry || (CountryPhoneCodes[0].code as CountryCode);

    let parsedNumber;
    try {
      parsedNumber = parsePhoneNumberFromString(value || '', {
        defaultCountry: defaultCountryCode,
      });
    } catch {
      parsedNumber = null;
    }

    const initialCountry = parsedNumber?.country || defaultCountryCode;
    const [selectedCountry, setSelectedCountry] = useState<TCountryCode>(
      CountryPhoneCodes.find((c) => c.code === initialCountry) ||
        CountryPhoneCodes[0],
    );

    const initialValue = value
      ? parsedNumber
        ? parsedNumber.formatInternational()
        : value
      : selectedCountry.dial_code;
    const [phoneNumber, setPhoneNumber] = useState<string>(
      formatPhoneNumber({ value: initialValue || selectedCountry.dial_code }),
    );

    const [open, setOpen] = useState<boolean>(false);

    const handleSelect = (phoneCode: string) => {
      const country = CountryPhoneCodes.find((c) => c.dial_code === phoneCode);
      if (country) {
        setSelectedCountry(country);
        setPhoneNumber(country.dial_code);
      }
      setOpen(false);
      if (ref && typeof ref !== 'function' && 'current' in ref) {
        ref.current?.focus();
      }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let input = e.target.value;
      if (!input.startsWith('+')) {
        input = '+' + input;
      }

      let parsedNumber;
      try {
        parsedNumber = parsePhoneNumberFromString(input);
      } catch {
        parsedNumber = null;
      }

      const countryCode = parsedNumber?.country;
      if (countryCode) {
        const newCountry = CountryPhoneCodes.find(
          (c) => c.code === countryCode,
        );
        if (newCountry) {
          setSelectedCountry(newCountry);
        }
      }

      setPhoneNumber(
        formatPhoneNumber({
          defaultCountry: selectedCountry.code as CountryCode,
          value: input,
        }),
      );
      onChange(
        input.replace(/[a-zA-Z\s]/g, ''),
        selectedCountry.code as CountryCode,
      );
    };
    const handleBlur = () => {
      if (!phoneNumber.startsWith('+')) {
        const updatedNumber = '+' + phoneNumber;
        setPhoneNumber(updatedNumber);
        onChange(
          updatedNumber.replace(/[a-zA-Z\s]/g, ''),
          selectedCountry.code as CountryCode,
        );
      }
    };

    return (
      <div className={cn('flex items-center justify-start', className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-expanded={open}
              className="rounded-l-md shadow-none size-7 focus-visible:ring-none focus:ring-none focus:shadow-focus focus:border-none focus:z-10"
            >
              <span>{selectedCountry.flag}</span>
            </Button>
          </Popover.Trigger>
          <Popover.Content className="w-56 p-0" align="start">
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
                        <span className="ml-2 text-sm text-muted-foreground">
                          {country.dial_code}
                        </span>
                      </div>
                      {selectedCountry.code === country.code && (
                        <IconCheck className="size-4" />
                      )}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </Popover.Content>
        </Popover>
        <Input
          value={phoneNumber}
          onChange={handlePhoneChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          ref={ref}
          variant="secondary"
        />
      </div>
    );
  },
);
