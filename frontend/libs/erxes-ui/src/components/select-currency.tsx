import { Combobox, Command, Popover } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';
import { Currency, CurrencyCode } from 'erxes-ui/types';
import { CURRENCY_CODES } from 'erxes-ui/constants';
import { useState } from 'react';
import { IconCoins } from '@tabler/icons-react';
export const SelectCurrency = ({
  value,
  currencies = CURRENCY_CODES,
  className,
  displayIcon = false,
  onChange,
  open,
  setOpen,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  value: CurrencyCode;
  currencies?: Record<CurrencyCode, Currency>;
  className?: string;
  displayIcon?: boolean;
  onChange?: (value: CurrencyCode) => void;
}) => {
  const [_open, _setOpen] = useState(false);
  const selectedCurrency = currencies[value];
  const SelectedCurrencyIcon = selectedCurrency
    ? selectedCurrency.Icon
    : IconCoins;

  return (
    <Popover modal open={open || _open} onOpenChange={setOpen || _setOpen}>
      <Combobox.Trigger
        variant="outline"
        className={className}
        onClick={(e) => e.stopPropagation()}
      >
        {selectedCurrency ? (
          displayIcon ? (
            <SelectedCurrencyIcon />
          ) : (
            <>
              <SelectedCurrencyIcon />{' '}
              <span className="mr-auto">{selectedCurrency.label}</span>
            </>
          )
        ) : (
          <Combobox.Value placeholder="Select currency" />
        )}
      </Combobox.Trigger>
      <Combobox.Content>
        <Command>
          <Command.Input placeholder="Search currency" />
          <Command.List>
            <Command.Empty>No currency found</Command.Empty>
            {Object.entries(currencies).map(([code, { label, Icon }]) => (
              <Command.Item
                key={code}
                value={code}
                onSelect={() => {
                  onChange?.(code as CurrencyCode);
                  setOpen?.(false);
                  _setOpen(false);
                }}
              >
                <Icon />
                {label}
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </Combobox.Content>
    </Popover>
  );
};
