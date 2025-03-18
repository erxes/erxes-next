import { IconChevronDown } from '@tabler/icons-react';
import { Button, Combobox, Command, Popover } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';
import { Currency, CurrencyCode } from 'erxes-ui/types';

export const SelectCurrency = ({
  value,
  currencies,
  className,
  displayIcon = false,
}: {
  value: CurrencyCode;
  currencies: Record<CurrencyCode, Currency>;
  className?: string;
  displayIcon?: boolean;
}) => {
  const selectedCurrency = Object.entries(currencies).find(
    ([code]) => code === value,
  );

  const SelectedCurrencyIcon = selectedCurrency
    ? selectedCurrency[1].Icon
    : null;

  return (
    <Popover modal>
      <Combobox.Trigger
        variant="outline"
        className={cn(
          'h-full rounded-none border-r-0 relative focus-visible:z-10',
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {SelectedCurrencyIcon && displayIcon ? (
          <SelectedCurrencyIcon className="w-4 h-4" />
        ) : (
          value
        )}
      </Combobox.Trigger>
      <Combobox.Content>
        <Command>
          <Command.Input placeholder="Search currency..." />
          <Command.List>
            <Command.Empty>No currency found</Command.Empty>
            {Object.entries(currencies).map(([code, { label, Icon }]) => (
              <Command.Item key={code} value={code}>
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
