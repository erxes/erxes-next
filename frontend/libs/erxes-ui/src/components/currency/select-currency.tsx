import { IconChevronDown } from '@tabler/icons-react';
import { Button, Command, Popover } from 'erxes-ui';
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

  const displayContent = () => {
    if (!selectedCurrency) return null;

    if (displayIcon) {
      const CurrencyIcon = selectedCurrency[1].Icon;
      return <CurrencyIcon className="w-4 h-4" />;
    }

    return value;
  };

  return (
    <Popover modal>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          className={cn(
            'h-cell rounded-none border-r-0 relative focus-visible:z-10',
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {displayContent()}
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
