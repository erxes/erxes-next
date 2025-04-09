import {
  Combobox,
  Command,
  Popover,
  Skeleton,
  TextOverflowTooltip,
} from 'erxes-ui';
import { useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { IAccount } from '../type/Account';

import React from 'react';

export const SelectAccount = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  React.ComponentProps<typeof Combobox.Trigger> & {
    value?: string;
    onValueChange: (value: string) => void;
    journal?: string;
  }
>(({ value, onValueChange, journal, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const { accounts, loading, error } = useAccounts({
    variables: {
      journals: [journal],
    },
    skip: (!value && !open) || !journal,
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Combobox.Trigger ref={ref} {...props}>
        {loading ? (
          <Skeleton className="w-full h-4" />
        ) : (
          <Combobox.Value
            placeholder="Select account"
            value={
              accounts?.find((account: IAccount) => account._id === value)?.name
            }
          />
        )}
      </Combobox.Trigger>
      <Combobox.Content>
        <Command>
          <Command.Input placeholder="Search account" />
          <Command.List>
            <Combobox.Empty loading={loading} error={error} />
            {accounts?.map((account: IAccount) => (
              <Command.Item
                key={account._id}
                value={account._id}
                onSelect={() => {
                  onValueChange(account._id);
                  setOpen(false);
                }}
              >
                <TextOverflowTooltip value={account.name} />
                <Combobox.Check checked={account._id === value} />
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </Combobox.Content>
    </Popover>
  );
});

SelectAccount.displayName = 'SelectAccount';
