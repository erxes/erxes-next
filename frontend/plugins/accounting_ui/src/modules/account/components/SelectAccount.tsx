import { Combobox, Command, Popover, Skeleton } from 'erxes-ui';
import { useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { IAccount } from '../type/Account';

export const SelectAccount = ({
  value,
  onChange,
  journal,
}: {
  value: string;
  onChange: (value: string) => void;
  journal?: string;
}) => {
  const [open, setOpen] = useState(false);
  const { accounts, loading, error } = useAccounts({
    variables: {
      journals: [journal],
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Combobox variant="outline" className="flex w-full">
          {!value && 'Select Account'}
          {loading ? (
            <Skeleton className="w-full h-8" />
          ) : (
            accounts?.find((account: IAccount) => account._id === value)?.name
          )}
        </Combobox>
      </Popover.Trigger>
      <Popover.Content className="p-0">
        <Command>
          <Command.Input placeholder="Search account" />
          <Command.List>
            <Command.Empty>{loading && <Command.Skeleton />}</Command.Empty>
            {accounts?.map((account: IAccount) => (
              <Command.Item
                key={account._id}
                value={account._id}
                onSelect={() => onChange(account._id)}
              >
                {account.name}
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </Popover.Content>
    </Popover>
  );
};
