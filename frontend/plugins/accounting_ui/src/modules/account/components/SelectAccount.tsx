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

export const SelectAccount = ({
  value,
  onChange,
  journal,
}: {
  value?: string;
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
      <Combobox.Trigger variant="outline" className="flex w-full">
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
                onSelect={() => onChange(account._id)}
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
};
