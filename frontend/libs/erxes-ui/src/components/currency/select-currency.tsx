import { IconChevronDown } from '@tabler/icons-react';
import { Button, Command, Popover } from 'erxes-ui/components';
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
      <Popover.Trigger asChild>
        <Button
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
          <IconChevronDown className={`w-4 h-4 ${!displayIcon && 'ml-2'}`} />
        </Button>
      </Popover.Trigger>
      <Popover.Content side="bottom" align="start" className="p-0">
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
      </Popover.Content>
    </Popover>
  );
};
