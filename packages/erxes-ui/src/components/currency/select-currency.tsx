import { IconChevronDown } from '@tabler/icons-react';
import { Button, Command, Popover } from 'erxes-ui';
import { Currency, CurrencyCode } from 'erxes-ui/types';

export const SelectCurrency = ({
  value,
  currencies,
}: {
  value: CurrencyCode;
  currencies: Record<CurrencyCode, Currency>;
}) => {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          className="h-cell rounded-none border-r-0 relative focus-visible:z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {value}
          <IconChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </Popover.Trigger>
      <Popover.Content side="bottom" align="start" className="p-0">
        <Command>
          <Command.Input placeholder="Search currency..." variant="secondary" />
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
